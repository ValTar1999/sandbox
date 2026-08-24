import { api, buildQuery, type ListResponse } from './client';
import type { ListParams } from './queryKeys';
import type { Receivable } from '../pages/InvoicesReceivables/data';

export type ReceivablesCounts = Record<string, number>;
export type ReceivablesList = ListResponse<Receivable, ReceivablesCounts>;

export const fetchReceivables = (params: ListParams) =>
  api.get<ReceivablesList>(
    `/receivables${buildQuery({
      tab: params.tab,
      search: params.search,
      page: params.page,
      perPage: params.perPage,
    })}`
  );

export const fetchReceivable = (id: string) =>
  api.get<Receivable>(`/receivables/${id}`);

export const collectReceivable = (id: string) =>
  api.post<Receivable>(`/receivables/${id}/collect`);

export const cancelReceivable = (id: string) =>
  api.post<Receivable>(`/receivables/${id}/cancel`);

export const rerunReceivable = (id: string) =>
  api.post<Receivable>(`/receivables/${id}/rerun`);
