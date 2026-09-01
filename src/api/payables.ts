import { api, buildQuery, type ListResponse } from './client';
import type { ListParams } from './queryKeys';
import type { Payment } from '../pages/BillsPayables/data';

export type PayablesCounts = Record<string, number>;

export type PayablesList = ListResponse<Payment, PayablesCounts>;

export const fetchPayables = (params: ListParams) =>
  api.get<PayablesList>(
    `/payables${buildQuery({
      tab: params.tab,
      search: params.search,
      page: params.page,
      perPage: params.perPage,
    })}`
  );

export const fetchPayable = (id: string) => api.get<Payment>(`/payables/${id}`);

export const payPayable = (
  id: string,
  body: { method?: string; scheduledFor?: string | null } = {}
) => api.post<Payment>(`/payables/${id}/pay`, body);

export const payPayablesBulk = (body: { ids: string[]; method?: string }) =>
  api.post<{ paidIds: string[]; paid: number }>('/payables/pay-bulk', body);

export const cancelPayable = (id: string) =>
  api.post<Payment>(`/payables/${id}/cancel`);

export const cancelPayablesBulk = (id: string) =>
  api.post<{ cancelledIds: string[]; cancelled: number }>(
    `/payables/${id}/cancel-bulk`
  );

export const rerunPayable = (id: string) =>
  api.post<Payment>(`/payables/${id}/rerun`);
