import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys, type ListParams } from '../../api/queryKeys';
import {
  fetchPayable,
  fetchPayables,
  payPayable,
  payPayablesBulk,
  cancelPayable,
  cancelPayablesBulk,
  rerunPayable,
} from '../../api/payables';

export const usePayables = (params: ListParams) =>
  useQuery({
    queryKey: queryKeys.payables.list(params),
    queryFn: () => fetchPayables(params),
    placeholderData: keepPreviousData,
  });

export const usePayable = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.payables.detail(id),
    queryFn: () => fetchPayable(id as string),
    enabled: Boolean(id),
  });

const useInvalidatePayables = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.payables.all });
};

export const usePayPayable = () => {
  const invalidate = useInvalidatePayables();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      method?: string;
      scheduledFor?: string | null;
    }) => payPayable(id, body),
    onSuccess: invalidate,
  });
};

export const usePayPayablesBulk = () => {
  const invalidate = useInvalidatePayables();

  return useMutation({
    mutationFn: payPayablesBulk,
    onSuccess: invalidate,
  });
};

export const useCancelPayable = () => {
  const invalidate = useInvalidatePayables();

  return useMutation({
    mutationFn: cancelPayable,
    onSuccess: invalidate,
  });
};

export const useCancelPayablesBulk = () => {
  const invalidate = useInvalidatePayables();

  return useMutation({
    mutationFn: cancelPayablesBulk,
    onSuccess: invalidate,
  });
};

export const useRerunPayable = () => {
  const invalidate = useInvalidatePayables();

  return useMutation({
    mutationFn: rerunPayable,
    onSuccess: invalidate,
  });
};
