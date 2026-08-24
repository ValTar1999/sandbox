import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import {
  deletePayerCard,
  fetchPayerCards,
  fetchVendors,
  updateVendor,
} from '../../api/vendors';
import type { PaymentNetworkStatus } from '../../pages/Vendors/data';

export const useVendors = () =>
  useQuery({
    queryKey: queryKeys.vendors.list(),
    queryFn: fetchVendors,
  });

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      paymentNetworkStatus,
    }: {
      id: string;
      paymentNetworkStatus: PaymentNetworkStatus;
    }) => updateVendor(id, { paymentNetworkStatus }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.vendors.all }),
  });
};

export const usePayerCards = () =>
  useQuery({
    queryKey: queryKeys.payerCards.list(),
    queryFn: fetchPayerCards,
  });

export const useDeletePayerCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayerCard,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.payerCards.all }),
  });
};
