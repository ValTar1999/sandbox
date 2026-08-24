import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys, type ListParams } from '../../api/queryKeys';
import {
  cancelReceivable,
  collectReceivable,
  fetchReceivable,
  fetchReceivables,
  rerunReceivable,
} from '../../api/receivables';

export const useReceivables = (params: ListParams) =>
  useQuery({
    queryKey: queryKeys.receivables.list(params),
    queryFn: () => fetchReceivables(params),
    placeholderData: keepPreviousData,
  });

export const useReceivable = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.receivables.detail(id),
    queryFn: () => fetchReceivable(id as string),
    enabled: Boolean(id),
  });

const useInvalidateReceivables = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.receivables.all });
};

export const useCollectReceivable = () => {
  const invalidate = useInvalidateReceivables();

  return useMutation({
    mutationFn: collectReceivable,
    onSuccess: invalidate,
  });
};

export const useCancelReceivable = () => {
  const invalidate = useInvalidateReceivables();

  return useMutation({
    mutationFn: cancelReceivable,
    onSuccess: invalidate,
  });
};

export const useRerunReceivable = () => {
  const invalidate = useInvalidateReceivables();

  return useMutation({
    mutationFn: rerunReceivable,
    onSuccess: invalidate,
  });
};
