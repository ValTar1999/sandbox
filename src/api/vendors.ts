import { api } from './client';
import type { PaymentNetworkStatus, Vendor } from '../pages/Vendors/data';
import type { PayerCard } from '../pages/SmartExchange/PaymentPreferences/data';

export const fetchVendors = () => api.get<{ rows: Vendor[] }>('/vendors');

export const updateVendor = (
  id: string,
  body: { paymentNetworkStatus: PaymentNetworkStatus }
) => api.patch<Vendor>(`/vendors/${id}`, body);

export const fetchPayerCards = () =>
  api.get<{ rows: PayerCard[] }>('/payer-cards');

export const deletePayerCard = (id: string) =>
  api.delete<void>(`/payer-cards/${id}`);
