import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { LOADING_DURATION_MS } from '../../constants/animations';
import { getDb, updateDb } from '../db';
import type { Payment } from '../../pages/BillsPayables/data';

/**
 * The seed keeps bills in four separate arrays; the database holds one
 * collection and the tabs are a filter over `status`, so paying a bill can
 * actually move it between tabs.
 */
const TAB_STATUSES: Record<string, string[]> = {
  'ready-to-pay': ['unprocessed'],
  'in-progress': ['processed', 'pastDue'],
  paid: ['paid'],
  exceptions: ['failed'],
};

const PAYMENT_TYPE_BY_METHOD: Record<string, string> = {
  ach: 'ACH',
  wire: 'Wire',
  card: 'Card',
  'smart-disburse': 'SMART Disburse',
  rtp: 'RTP',
  check: 'Check',
  smart: 'SMART Exchange',
};

const countByTab = (rows: Payment[]) => {
  const counts: Record<string, number> = {};

  for (const [tab, statuses] of Object.entries(TAB_STATUSES)) {
    counts[tab] = rows.reduce(
      (total, row) => total + (statuses.includes(row.status) ? 1 : 0),
      0
    );
  }

  return counts;
};

const markProcessing = (
  row: Payment,
  method?: string,
  bulkGroupId?: string
) => {
  row.status = 'processed';
  if (method && PAYMENT_TYPE_BY_METHOD[method]) {
    row.paymentType = PAYMENT_TYPE_BY_METHOD[method];
  }
  if (bulkGroupId) {
    row.bulkGroupId = bulkGroupId;
  } else {
    delete row.bulkGroupId;
  }
};

const markUnprocessed = (row: Payment) => {
  row.status = 'unprocessed';
  delete row.bulkGroupId;
};

const payableNotFound = () =>
  HttpResponse.json({ message: 'Payment not found' }, { status: 404 });

const cancelProcessedPayment = (row: Payment) => {
  if (row.status !== 'processed' && row.status !== 'pastDue') {
    return HttpResponse.json(
      { message: 'Only an in-progress payment can be cancelled.' },
      { status: 409 }
    );
  }
  return null;
};

const matchesSearch = (row: Payment, search: string) =>
  row.payee.toLowerCase().includes(search) ||
  row.billReference.toLowerCase().includes(search) ||
  row.totalAmount.toLowerCase().includes(search) ||
  row.source.toLowerCase().includes(search) ||
  row.id.toLowerCase().includes(search) ||
  (row.paymentType?.toLowerCase().includes(search) ?? false);

export const payablesHandlers = [
  http.get(apiUrl('/payables'), async ({ request }) => {
    await delay(LOADING_DURATION_MS);

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const page = Number(url.searchParams.get('page')) || 0;
    const perPage = Number(url.searchParams.get('perPage')) || 0;

    const all = getDb().payables;
    const statuses = tab ? TAB_STATUSES[tab] : undefined;
    const filtered = all.filter(
      (row) =>
        (!statuses || statuses.includes(row.status)) &&
        (!search || matchesSearch(row, search))
    );

    const rows =
      page > 0 && perPage > 0
        ? filtered.slice((page - 1) * perPage, page * perPage)
        : filtered;

    return HttpResponse.json({
      rows,
      total: filtered.length,
      counts: countByTab(all),
    });
  }),

  http.get(apiUrl('/payables/:id'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = getDb().payables.find((item) => item.id === params.id);
    return row
      ? HttpResponse.json(row)
      : HttpResponse.json({ message: 'Payment not found' }, { status: 404 });
  }),

  http.post(apiUrl('/payables/pay-bulk'), async ({ request }) => {
    const body = (await request.json()) as { ids?: string[]; method?: string };

    await delay(LOADING_DURATION_MS);

    if (!body.ids?.length) {
      return HttpResponse.json(
        { message: 'Select at least one bill to pay.' },
        { status: 400 }
      );
    }

    const result = updateDb((db) => {
      const ids = new Set(body.ids);
      const paid: string[] = [];
      const bulkGroupId = `bulk-${Date.now()}`;

      for (const row of db.payables) {
        if (!ids.has(row.id)) continue;
        if (row.status !== 'unprocessed') continue;

        markProcessing(row, body.method, bulkGroupId);
        paid.push(row.id);
      }

      return paid;
    });

    return HttpResponse.json({ paidIds: result, paid: result.length });
  }),

  http.post(apiUrl('/payables/:id/pay'), async ({ params, request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      method?: string;
      scheduledFor?: string | null;
    };

    await delay(LOADING_DURATION_MS);

    const row = getDb().payables.find((item) => item.id === params.id);
    if (!row) {
      return HttpResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }
    if (row.status !== 'unprocessed') {
      return HttpResponse.json(
        { message: 'This bill has already been submitted for payment.' },
        { status: 409 }
      );
    }

    const updated = updateDb((db) => {
      const target = db.payables.find(
        (item) => item.id === params.id
      ) as Payment;
      markProcessing(target, body.method);
      return target;
    });

    return HttpResponse.json(updated);
  }),

  http.post(apiUrl('/payables/:id/cancel'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = getDb().payables.find((item) => item.id === params.id);
    if (!row) return payableNotFound();

    const conflict = cancelProcessedPayment(row);
    if (conflict) return conflict;

    const updated = updateDb((db) => {
      const target = db.payables.find(
        (item) => item.id === params.id
      ) as Payment;
      markUnprocessed(target);
      return target;
    });

    return HttpResponse.json(updated);
  }),

  http.post(apiUrl('/payables/:id/cancel-bulk'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = getDb().payables.find((item) => item.id === params.id);
    if (!row) return payableNotFound();

    const conflict = cancelProcessedPayment(row);
    if (conflict) return conflict;

    const cancelled = updateDb((db) => {
      const target = db.payables.find(
        (item) => item.id === params.id
      ) as Payment;
      const groupId = target.bulkGroupId;
      const cancelledIds: string[] = [];

      for (const item of db.payables) {
        const inGroup = groupId
          ? item.bulkGroupId === groupId
          : item.id === target.id;
        if (!inGroup) continue;
        if (item.status !== 'processed' && item.status !== 'pastDue') continue;
        markUnprocessed(item);
        cancelledIds.push(item.id);
      }

      return cancelledIds;
    });

    return HttpResponse.json({
      cancelledIds: cancelled,
      cancelled: cancelled.length,
    });
  }),

  http.post(apiUrl('/payables/:id/rerun'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = getDb().payables.find((item) => item.id === params.id);
    if (!row) return payableNotFound();
    if (row.status !== 'failed') {
      return HttpResponse.json(
        { message: 'Only a failed payment can be re-run.' },
        { status: 409 }
      );
    }

    const updated = updateDb((db) => {
      const target = db.payables.find((item) => item.id === params.id) as Payment;
      markProcessing(target);
      return target;
    });

    return HttpResponse.json(updated);
  }),
];
