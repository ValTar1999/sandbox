import { delay, http, HttpResponse } from 'msw';
import { apiUrl } from '../../api/paths';
import { LOADING_DURATION_MS } from '../../constants/animations';
import { getDb, updateDb } from '../db';
import type { PaymentNetworkStatus, Vendor } from '../../pages/Vendors/data';

export const vendorsHandlers = [
  http.get(apiUrl('/vendors'), async () => {
    await delay(LOADING_DURATION_MS);
    return HttpResponse.json({ rows: getDb().vendors });
  }),

  http.patch(apiUrl('/vendors/:id'), async ({ params, request }) => {
    const body = (await request.json()) as {
      paymentNetworkStatus?: PaymentNetworkStatus;
    };

    await delay(LOADING_DURATION_MS);

    const existing = getDb().vendors.find((item) => item.id === params.id);
    if (!existing) {
      return HttpResponse.json(
        { message: 'Vendor not found' },
        { status: 404 }
      );
    }

    const updated = updateDb((db) => {
      const vendor = db.vendors.find((item) => item.id === params.id) as Vendor;
      if (body.paymentNetworkStatus) {
        vendor.paymentNetworkStatus = body.paymentNetworkStatus;
      }
      return vendor;
    });

    return HttpResponse.json(updated);
  }),

  http.get(apiUrl('/payer-cards'), async () => {
    await delay(LOADING_DURATION_MS);
    return HttpResponse.json({ rows: getDb().payerCards });
  }),

  http.delete(apiUrl('/payer-cards/:id'), async ({ params }) => {
    await delay(LOADING_DURATION_MS);

    const exists = getDb().payerCards.some((card) => card.id === params.id);
    if (!exists) {
      return HttpResponse.json({ message: 'Card not found' }, { status: 404 });
    }

    updateDb((db) => {
      db.payerCards = db.payerCards.filter((card) => card.id !== params.id);
    });

    return new HttpResponse(null, { status: 204 });
  }),
];
