import { api, buildQuery, type ListResponse } from './client';
import type { ListParams } from './queryKeys';
import type {
  SmartExchangePayment,
  SmartExchangeTab,
} from '../pages/SmartExchange/data';
import type {
  GlobalPaymentPreferences,
  PayerSpecificPreferenceRow,
} from '../pages/SmartExchange/PaymentPreferences/data';
import type { CardProcessingState } from '../server/db';

export type SmartExchangeCounts = Record<SmartExchangeTab, number>;

export type SmartExchangeList = ListResponse<
  SmartExchangePayment,
  SmartExchangeCounts
>;

export type StoredPaymentPreferences = {
  global: GlobalPaymentPreferences;
  payerRows: PayerSpecificPreferenceRow[];
  cardProcessing: CardProcessingState;
};

export const fetchSmartExchangePayments = (params: ListParams) =>
  api.get<SmartExchangeList>(
    `/smart-exchange/payments${buildQuery({
      tab: params.tab,
      search: params.search,
      page: params.page,
      perPage: params.perPage,
    })}`
  );

export const fetchSmartExchangePayment = (id: string) =>
  api.get<SmartExchangePayment>(`/smart-exchange/payments/${id}`);

export const markSmartExchangePaymentPaid = (id: string) =>
  api.post<SmartExchangePayment>(`/smart-exchange/payments/${id}/mark-paid`);

export const submitGetPaid = (
  id: string,
  body: {
    method: string;
    bankAccount: string;
    signedBy: string | null;
    acceptedAttachments: string[];
  }
) =>
  api.post<SmartExchangePayment>(
    `/smart-exchange/payments/${id}/get-paid`,
    body
  );

export const submitDispute = (
  id: string,
  body: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    message: string;
  }
) =>
  api.post<SmartExchangePayment>(
    `/smart-exchange/payments/${id}/dispute`,
    body
  );

export const fetchPaymentPreferences = () =>
  api.get<StoredPaymentPreferences>('/payment-preferences');

export const savePaymentPreferences = (body: {
  global?: GlobalPaymentPreferences;
  payerRows?: PayerSpecificPreferenceRow[];
  cardProcessing?: Partial<CardProcessingState>;
}) => api.put<StoredPaymentPreferences>('/payment-preferences', body);
