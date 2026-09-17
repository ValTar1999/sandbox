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

type PayablesFilters = Partial<Record<string, string[]>>;

const normalizePayeeText = (value: string) =>
  value.toLowerCase().replace(/[`']/g, "'");

const STATUS_FILTER_MAP: Record<string, string[]> = {
  Unprocessed: ['unprocessed'],
  Processing: ['processed'],
  'Pending Initiation': ['processed'],
  Initiated: ['processed'],
  Scheduled: ['processed'],
  'Past Due': ['pastDue'],
  Paid: ['paid'],
  Failed: ['failed'],
};

const PAYMENT_TYPE_FILTER_MAP: Record<string, string[]> = {
  Card: ['Card', 'card'],
  ACH: ['ACH', 'ach'],
  Wire: ['Wire', 'wire'],
  'SMART Disburse': ['SMART Disburse', 'sd', 'smart-disburse'],
  'SMART Exchange': ['SMART Exchange', 'smart'],
};

const parseAmountValue = (totalAmount: string) => {
  const parsed = Number(totalAmount.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const parseFilterDate = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parseRowDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const matchesPayeeFilter = (row: Payment, selected: string[]) => {
  const payee = normalizePayeeText(row.payee);
  const vendorNames = (row.vendors ?? []).map((vendor) =>
    normalizePayeeText(vendor.name)
  );

  return selected.some((option) => {
    const normalized = normalizePayeeText(option);
    return (
      payee.includes(normalized) ||
      vendorNames.some(
        (name) => name === normalized || name.includes(normalized)
      )
    );
  });
};

const matchesSourceFilter = (row: Payment, selected: string[]) =>
  selected.some((option) => {
    if (option === 'ERP') return row.source.toLowerCase().includes('erp');
    return row.source.toLowerCase() === option.toLowerCase();
  });

const matchesPaymentTypeFilter = (row: Payment, selected: string[]) => {
  const type = row.paymentType ?? '';
  return selected.some((option) =>
    (PAYMENT_TYPE_FILTER_MAP[option] ?? [option]).some(
      (alias) => alias.toLowerCase() === type.toLowerCase()
    )
  );
};

const matchesStatusFilter = (row: Payment, selected: string[]) =>
  selected.some((option) =>
    (STATUS_FILTER_MAP[option] ?? [option.toLowerCase()]).includes(row.status)
  );

const matchesAmountFilter = (row: Payment, range: string[]) => {
  const amount = parseAmountValue(row.totalAmount);
  if (amount == null) return false;

  const fromRaw = range[0]?.trim() ?? '';
  const toRaw = range[1]?.trim() ?? '';
  const from =
    fromRaw && fromRaw !== '0.00' ? Number(fromRaw.replace(/,/g, '')) : null;
  const to = toRaw && toRaw !== '0.00' ? Number(toRaw.replace(/,/g, '')) : null;

  if (from != null && !Number.isNaN(from) && amount < from) return false;
  if (to != null && !Number.isNaN(to) && amount > to) return false;
  return (
    (from != null && !Number.isNaN(from)) || (to != null && !Number.isNaN(to))
  );
};

const matchesDateRangeFilter = (
  rowDateValue: string | undefined,
  range: string[]
) => {
  if (!rowDateValue) return false;
  const rowDate = parseRowDate(rowDateValue);
  if (!rowDate) return false;

  const from = range[0] ? parseFilterDate(range[0]) : null;
  const to = range[1] ? parseFilterDate(range[1]) : null;
  if (from && rowDate < from) return false;
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (rowDate > end) return false;
  }
  return Boolean(from || to);
};

const hasAmountRange = (range?: string[]) => {
  if (!range?.length) return false;
  const from = range[0]?.trim() ?? '';
  const to = range[1]?.trim() ?? '';
  return (from !== '' && from !== '0.00') || (to !== '' && to !== '0.00');
};

const hasDateRange = (range?: string[]) =>
  Boolean(range?.[0]?.trim() || range?.[1]?.trim());

const matchesFilters = (row: Payment, filters: PayablesFilters) => {
  if (filters.payee?.length && !matchesPayeeFilter(row, filters.payee)) {
    return false;
  }
  if (filters.source?.length && !matchesSourceFilter(row, filters.source)) {
    return false;
  }
  if (
    filters.paymentType?.length &&
    !matchesPaymentTypeFilter(row, filters.paymentType)
  ) {
    return false;
  }
  if (filters.status?.length && !matchesStatusFilter(row, filters.status)) {
    return false;
  }
  if (filters.checkStatus?.length) {
    // Seed data has no check-status field yet; ignore until available.
  }
  if (filters.failureReasons?.length) {
    // Seed data has no failure-reason field yet; ignore until available.
  }
  if (
    hasAmountRange(filters.amount) &&
    !matchesAmountFilter(row, filters.amount!)
  ) {
    return false;
  }
  if (
    hasDateRange(filters.dueDate) &&
    !matchesDateRangeFilter(row.dueDate, filters.dueDate!)
  ) {
    return false;
  }
  if (
    hasDateRange(filters.paymentDate) &&
    !matchesDateRangeFilter(row.unprocessed?.date, filters.paymentDate!)
  ) {
    return false;
  }
  return true;
};

const parseFiltersParam = (raw: string | null): PayablesFilters => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as PayablesFilters;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const payablesHandlers = [
  http.get(apiUrl('/payables'), async ({ request }) => {
    await delay(LOADING_DURATION_MS);

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const filters = parseFiltersParam(url.searchParams.get('filters'));
    const page = Number(url.searchParams.get('page')) || 0;
    const perPage = Number(url.searchParams.get('perPage')) || 0;

    const all = getDb().payables;
    const statuses = tab ? TAB_STATUSES[tab] : undefined;
    const filtered = all.filter(
      (row) =>
        (!statuses || statuses.includes(row.status)) &&
        (!search || matchesSearch(row, search)) &&
        matchesFilters(row, filters)
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
      const target = db.payables.find(
        (item) => item.id === params.id
      ) as Payment;
      markProcessing(target);
      return target;
    });

    return HttpResponse.json(updated);
  }),
];
