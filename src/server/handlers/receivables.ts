import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { LOADING_DURATION_MS } from '../../constants/animations';
import { getDb, updateDb } from '../db';
import type { Receivable } from '../../pages/InvoicesReceivables/data';

const TAB_STATUSES: Record<string, string[]> = {
  'ready-to-invoice': ['unprocessed'],
  'in-progress': ['processed', 'pastDue'],
  paid: ['paid'],
  exceptions: ['failed'],
};

const countByTab = (rows: Receivable[]) => {
  const counts: Record<string, number> = {};

  for (const [tab, statuses] of Object.entries(TAB_STATUSES)) {
    counts[tab] = rows.reduce(
      (total, row) => total + (statuses.includes(row.status) ? 1 : 0),
      0
    );
  }

  return counts;
};

const findReceivable = (id: string | readonly string[] | undefined) => {
  const key = String(id ?? '');
  return getDb().receivables.find(
    (item) => item.id === key || item.invoiceNumber === key
  );
};

const notFound = () =>
  HttpResponse.json({ message: 'Receivable not found' }, { status: 404 });

const matchesSearch = (row: Receivable, search: string) =>
  row.invoiceNumber.toLowerCase().includes(search) ||
  row.customer.toLowerCase().includes(search) ||
  row.amount.toLowerCase().includes(search);

const markCollected = (row: Receivable) => {
  row.status = 'processed';
  row.paymentType = row.paymentType ?? 'smartCollect';
  if (!row.paymentMethods?.length) {
    row.paymentMethods = [
      {
        id: `pm-${row.id}`,
        type: 'smartCollect',
        label: 'SMART Collect',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        status: 'waitingOnCustomer',
      },
    ];
  }
};

export const receivablesHandlers = [
  http.get(apiUrl('/receivables'), async ({ request }) => {
    await delay(LOADING_DURATION_MS);

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const page = Number(url.searchParams.get('page')) || 0;
    const perPage = Number(url.searchParams.get('perPage')) || 0;

    const all = getDb().receivables;
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

  http.get(apiUrl('/receivables/:id'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);
    const row = findReceivable(params.id);
    return row ? HttpResponse.json(row) : notFound();
  }),

  http.post(apiUrl('/receivables/:id/collect'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = findReceivable(params.id);
    if (!row) return notFound();
    if (row.status !== 'unprocessed') {
      return HttpResponse.json(
        { message: 'This invoice has already been submitted.' },
        { status: 409 }
      );
    }

    const updated = updateDb((db) => {
      const target = db.receivables.find(
        (item) => item.id === row.id
      ) as Receivable;
      markCollected(target);
      return target;
    });

    return HttpResponse.json(updated);
  }),

  http.post(apiUrl('/receivables/:id/cancel'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = findReceivable(params.id);
    if (!row) return notFound();
    if (row.status !== 'processed' && row.status !== 'pastDue') {
      return HttpResponse.json(
        { message: 'Only an in-progress receivable can be cancelled.' },
        { status: 409 }
      );
    }

    const updated = updateDb((db) => {
      const target = db.receivables.find(
        (item) => item.id === row.id
      ) as Receivable;
      target.status = 'unprocessed';
      return target;
    });

    return HttpResponse.json(updated);
  }),

  http.post(apiUrl('/receivables/:id/rerun'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = findReceivable(params.id);
    if (!row) return notFound();
    if (row.status !== 'failed') {
      return HttpResponse.json(
        { message: 'Only a failed receivable can be re-run.' },
        { status: 409 }
      );
    }

    const updated = updateDb((db) => {
      const target = db.receivables.find(
        (item) => item.id === row.id
      ) as Receivable;
      markCollected(target);
      return target;
    });

    return HttpResponse.json(updated);
  }),
];
