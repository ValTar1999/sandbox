import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import {
  fetchPaymentPreferences,
  savePaymentPreferences,
} from '../../api/smartExchange';

export const usePaymentPreferences = () =>
  useQuery({
    queryKey: queryKeys.paymentPreferences,
    queryFn: fetchPaymentPreferences,
  });

export const useSavePaymentPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePaymentPreferences,
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.paymentPreferences, saved);
    },
  });
};
