import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys, type ListParams } from '../../api/queryKeys';
import {
  fetchSmartExchangePayment,
  fetchSmartExchangePayments,
  markSmartExchangePaymentPaid,
  submitDispute,
  submitGetPaid,
} from '../../api/smartExchange';

export const useSmartExchangePayments = (params: ListParams) =>
  useQuery({
    queryKey: queryKeys.smartExchange.list(params),
    queryFn: () => fetchSmartExchangePayments(params),
    // Keeps the table populated while a new tab or page loads, so the loading
    // overlay fades over real rows instead of an empty table.
    placeholderData: keepPreviousData,
  });

export const useSmartExchangePayment = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.smartExchange.detail(id),
    queryFn: () => fetchSmartExchangePayment(id as string),
    enabled: Boolean(id),
  });

const useInvalidateSmartExchange = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.smartExchange.all });
};

export const useMarkPaymentPaid = () => {
  const invalidate = useInvalidateSmartExchange();

  return useMutation({
    mutationFn: markSmartExchangePaymentPaid,
    onSuccess: invalidate,
  });
};

export const useSubmitGetPaid = () => {
  const invalidate = useInvalidateSmartExchange();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      method: string;
      bankAccount: string;
      signedBy: string | null;
      acceptedAttachments: string[];
    }) => submitGetPaid(id, body),
    onSuccess: invalidate,
  });
};

export const useSubmitDispute = () => {
  const invalidate = useInvalidateSmartExchange();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
      phone: string;
      message: string;
    }) => submitDispute(id, body),
    onSuccess: invalidate,
  });
};

