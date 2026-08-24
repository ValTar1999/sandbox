import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { LOADING_DURATION_MS } from '../../constants/animations';
import { getDb, updateDb, type CardProcessingState } from '../db';
import type {
  SmartExchangePayment,
  SmartExchangeTab,
} from '../../pages/SmartExchange/data';

const matchesSearch = (row: SmartExchangePayment, search: string) =>
  row.invoiceNumber.toLowerCase().includes(search) ||
  row.vendorEntry.toLowerCase().includes(search) ||
  row.customer.toLowerCase().includes(search);

const countByTab = (rows: SmartExchangePayment[]) => {
  const counts: Record<SmartExchangeTab, number> = {
    pending: 0,
    paid: 0,
    exceptions: 0,
  };
  for (const row of rows) counts[row.tab] += 1;
  return counts;
};

const paymentNotFound = () =>
  HttpResponse.json({ message: 'Payment not found' }, { status: 404 });

export const smartExchangeHandlers = [
  http.get(apiUrl('/smart-exchange/payments'), async ({ request }) => {
    await delay(LOADING_DURATION_MS);

    const url = new URL(request.url);
    const tab = url.searchParams.get('tab') as SmartExchangeTab | null;
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const page = Number(url.searchParams.get('page')) || 0;
    const perPage = Number(url.searchParams.get('perPage')) || 0;

    const all = getDb().smartExchangePayments;
    const filtered = all.filter(
      (row) =>
        (!tab || row.tab === tab) && (!search || matchesSearch(row, search))
    );

    // Without pagination params the whole filtered set comes back, which is
    // what the CSV export needs.
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

  http.get(apiUrl('/smart-exchange/payments/:id'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const row = getDb().smartExchangePayments.find(
      (item) => item.id === params.id
    );
    return row ? HttpResponse.json(row) : paymentNotFound();
  }),

  http.post(
    apiUrl('/smart-exchange/payments/:id/mark-paid'),
    async ({ params }) => {
      await delay(LOADING_DURATION_MS);

      const updated = updateDb((db) => {
        const row = db.smartExchangePayments.find(
          (item) => item.id === params.id
        );
        if (!row) return null;

        row.status = 'paid';
        row.tab = 'paid';
        row.showGetPaid = false;
        return row;
      });

      return updated ? HttpResponse.json(updated) : paymentNotFound();
    }
  ),

  http.post(
    apiUrl('/smart-exchange/payments/:id/get-paid'),
    async ({ params, request }) => {
      const body = (await request.json()) as {
        method?: string;
        bankAccount?: string;
        signedBy?: string | null;
        acceptedAttachments?: string[];
      };

      await delay(LOADING_DURATION_MS);

      if (!body.method) {
        return HttpResponse.json(
          {
            message: 'Choose how you want to get paid.',
            fieldErrors: { method: 'Payment method is required.' },
          },
          { status: 400 }
        );
      }

      if (body.method === 'bank-account' && !body.bankAccount) {
        return HttpResponse.json(
          {
            message: 'Choose a bank account.',
            fieldErrors: { bankAccount: 'Bank account is required.' },
          },
          { status: 400 }
        );
      }

      const updated = updateDb((db) => {
        const row = db.smartExchangePayments.find(
          (item) => item.id === params.id
        );
        if (!row) return null;

        row.status = 'paid';
        row.tab = 'paid';
        row.showGetPaid = false;
        db.getPaidSubmissions[row.id] = {
          paymentId: row.id,
          method: body.method as string,
          bankAccount: body.bankAccount ?? '',
          signedBy: body.signedBy ?? null,
          acceptedAttachments: body.acceptedAttachments ?? [],
          submittedAt: new Date().toISOString(),
        };
        return row;
      });

      return updated ? HttpResponse.json(updated) : paymentNotFound();
    }
  ),

  http.post(
    apiUrl('/smart-exchange/payments/:id/dispute'),
    async ({ params, request }) => {
      const body = (await request.json()) as {
        firstName?: string;
        lastName?: string;
        company?: string;
        email?: string;
        phone?: string;
        message?: string;
      };

      await delay(LOADING_DURATION_MS);

      // Messages mirror the form copy so the existing inline errors render
      // unchanged, they just arrive from the server now.
      const fieldErrors: Record<string, string> = {};
      if (!body.firstName?.trim())
        fieldErrors.firstName = 'First Name is required.';
      if (!body.lastName?.trim())
        fieldErrors.lastName = 'Last Name is required.';
      if (!body.email?.trim()) fieldErrors.email = 'Email is required.';
      if (!body.phone?.trim()) fieldErrors.phone = 'Phone Number is required.';

      if (Object.keys(fieldErrors).length > 0) {
        return HttpResponse.json(
          { message: 'Please complete the dispute details.', fieldErrors },
          { status: 400 }
        );
      }

      const updated = updateDb((db) => {
        const row = db.smartExchangePayments.find(
          (item) => item.id === params.id
        );
        if (!row) return null;

        row.status = 'exception';
        row.tab = 'exceptions';
        row.showGetPaid = false;
        db.disputes[row.id] = {
          paymentId: row.id,
          firstName: body.firstName as string,
          lastName: body.lastName as string,
          company: body.company ?? '',
          email: body.email as string,
          phone: body.phone as string,
          message: body.message ?? '',
          submittedAt: new Date().toISOString(),
        };
        return row;
      });

      return updated ? HttpResponse.json(updated) : paymentNotFound();
    }
  ),

  http.get(apiUrl('/payment-preferences'), async () => {
    await delay(LOADING_DURATION_MS);
    return HttpResponse.json(getDb().paymentPreferences);
  }),

  http.put(apiUrl('/payment-preferences'), async ({ request }) => {
    const body = (await request.json()) as {
      global?: unknown;
      payerRows?: unknown;
      cardProcessing?: Partial<CardProcessingState>;
    };

    await delay(LOADING_DURATION_MS);

    const saved = updateDb((db) => {
      if (body.global) {
        db.paymentPreferences.global =
          body.global as typeof db.paymentPreferences.global;
      }
      if (body.payerRows) {
        db.paymentPreferences.payerRows =
          body.payerRows as typeof db.paymentPreferences.payerRows;
      }
      if (body.cardProcessing) {
        db.paymentPreferences.cardProcessing = {
          ...db.paymentPreferences.cardProcessing,
          ...body.cardProcessing,
        };
      }
      return db.paymentPreferences;
    });

    return HttpResponse.json(saved);
  }),
];
