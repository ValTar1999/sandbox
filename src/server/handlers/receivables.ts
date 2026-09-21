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

type ReceivablesFilters = Partial<
  Record<
    'customer' | 'paymentType' | 'status' | 'amount' | 'created' | 'dueDate',
    string[]
  >
>;

const PAYMENT_TYPE_FILTER_MAP: Record<string, string[]> = {
  'SMART Collect': ['smartCollect', 'SMART Collect'],
  Bank: ['bank', 'Bank'],
  Card: ['card', 'Card'],
  RFP: ['rfp', 'RFP'],
  ACH: ['ach', 'ACH'],
};

const STATUS_FILTER_MAP: Record<string, string[]> = {
  Unprocessed: ['unprocessed'],
  Processing: ['processed'],
  'Past Due': ['pastDue'],
  Paid: ['paid'],
  Failed: ['failed'],
  'Waiting On Customer': ['waitingOnCustomer'],
  'In Process': ['inProcess'],
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

const normalizeText = (value: string) => value.trim().toLowerCase();

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

const matchesCustomerFilter = (row: Receivable, selected: string[]) => {
  const customer = normalizeText(row.customer);
  return selected.some((option) => {
    const normalized = normalizeText(option);
    return customer === normalized || customer.includes(normalized);
  });
};

const matchesPaymentTypeFilter = (row: Receivable, selected: string[]) => {
  const types = new Set<string>();
  if (row.paymentType) types.add(row.paymentType);
  for (const method of row.paymentMethods ?? []) {
    types.add(method.type);
  }
  if (types.size === 0) return false;

  return selected.some((option) =>
    (PAYMENT_TYPE_FILTER_MAP[option] ?? [option]).some((alias) =>
      Array.from(types).some(
        (type) => type.toLowerCase() === alias.toLowerCase()
      )
    )
  );
};

const matchesStatusFilter = (row: Receivable, selected: string[]) => {
  const statuses = new Set<string>([row.status]);
  for (const method of row.paymentMethods ?? []) {
    statuses.add(method.status);
  }

  return selected.some((option) =>
    (STATUS_FILTER_MAP[option] ?? [option.toLowerCase()]).some((alias) =>
      statuses.has(alias)
    )
  );
};

const matchesAmountFilter = (row: Receivable, range: string[]) => {
  const amount = parseAmountValue(row.amount);
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
  if (!rowDateValue || rowDateValue === '-') return false;
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

const matchesFilters = (row: Receivable, filters: ReceivablesFilters) => {
  if (
    filters.customer?.length &&
    !matchesCustomerFilter(row, filters.customer)
  ) {
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
  if (
    hasAmountRange(filters.amount) &&
    !matchesAmountFilter(row, filters.amount!)
  ) {
    return false;
  }
  if (
    hasDateRange(filters.created) &&
    !matchesDateRangeFilter(row.created, filters.created!)
  ) {
    return false;
  }
  if (
    hasDateRange(filters.dueDate) &&
    !matchesDateRangeFilter(row.due, filters.dueDate!)
  ) {
    return false;
  }
  return true;
};

const parseFiltersParam = (raw: string | null): ReceivablesFilters => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as ReceivablesFilters;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

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
    const filters = parseFiltersParam(url.searchParams.get('filters'));
    const page = Number(url.searchParams.get('page')) || 0;
    const perPage = Number(url.searchParams.get('perPage')) || 0;

    const all = getDb().receivables;
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
