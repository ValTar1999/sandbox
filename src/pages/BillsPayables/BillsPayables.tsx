import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import RootTable from '../../components/common/base/RootTable';
import type { Payment } from './data';
import CancelPaymentModal from '../../modals/CancelPaymentModal';
import CancelBulkPaymentModal from '../../modals/CancelBulkPaymentModal';
import ReRunPaymentModal from '../../modals/ReRunPaymentModal';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import {
  useCancelPayable,
  useCancelPayablesBulk,
  usePayables,
  useRerunPayable,
} from '../../hooks/queries/usePayables';

/** Tab labels map to the slugs the backend filters by. */
const tabSlugs = {
  'Ready to Pay': 'ready-to-pay',
  'In Progress': 'in-progress',
  Paid: 'paid',
  Exceptions: 'exceptions',
} as const;

type StatusLabel = keyof typeof tabSlugs;

const BillsPayables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusLabel>('Ready to Pay');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelBulkPaymentModalOpen, setIsCancelBulkPaymentModalOpen] =
    useState(false);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null);
  const [bulkPaymentToCancel, setBulkPaymentToCancel] =
    useState<Payment | null>(null);

  const listParams = useMemo(
    () => ({
      tab: tabSlugs[activeTab],
      page: currentPage,
      perPage: itemsPerPage,
    }),
    [activeTab, currentPage, itemsPerPage]
  );

  const { data, isFetching, isError, error, refetch } = usePayables(listParams);
  const cancelPayable = useCancelPayable();
  const cancelPayablesBulk = useCancelPayablesBulk();
  const rerunPayable = useRerunPayable();

  const currentData = data?.rows ?? [];
  const total = data?.total ?? 0;
  const counts = data?.counts ?? {};
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const handleTabClick = (tab: StatusLabel) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleCancelClick = (payment: Payment) => {
    setPaymentToCancel(payment);
    setIsCancelModalOpen(true);
  };

  const handleReRunClick = async (payment: Payment) => {
    try {
      await rerunPayable.mutateAsync(payment.id);
    } catch (error) {
      console.error('[payables] could not re-run the payment', error);
      return;
    }

    setIsReRunModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!paymentToCancel) return;

    try {
      await cancelPayable.mutateAsync(paymentToCancel.id);
    } catch (error) {
      console.error('[payables] could not cancel the payment', error);
      return;
    }

    setIsCancelModalOpen(false);
    setPaymentToCancel(null);
  };

  const handleReRunConfirm = () => {
    setIsReRunModalOpen(false);
  };

  const handleCancelClose = () => {
    if (cancelPayable.isPending) return;
    setIsCancelModalOpen(false);
    setPaymentToCancel(null);
  };

  const handleCancelBulkPaymentClick = (payment: Payment) => {
    setBulkPaymentToCancel(payment);
    setIsCancelBulkPaymentModalOpen(true);
  };

  const handleCancelBulkPaymentConfirm = async () => {
    if (!bulkPaymentToCancel) return;

    try {
      await cancelPayablesBulk.mutateAsync(bulkPaymentToCancel.id);
    } catch (error) {
      console.error('[payables] could not cancel the bulk payment', error);
      return;
    }

    setIsCancelBulkPaymentModalOpen(false);
    setBulkPaymentToCancel(null);
  };

  const handleCancelBulkPaymentClose = () => {
    if (cancelPayablesBulk.isPending) return;
    setIsCancelBulkPaymentModalOpen(false);
    setBulkPaymentToCancel(null);
  };

  const handleReRunClose = () => {
    setIsReRunModalOpen(false);
  };

  const isReadyToPay = activeTab === 'Ready to Pay';

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          description={`${total} Payments`}
          selectedCount={isReadyToPay ? selectedIds.length : 0}
          onDeselect={() => setSelectedIds([])}
          onPay={() => {
            if (selectedIds.length > 0) {
              navigate('/payables/multiple', { state: { selectedIds } });
            }
          }}
        />
      }
      footer={
        <div className="w-full flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      }
    >
      <div className="px-6 py-4">
        <div className="flex gap-9">
          {(Object.keys(tabSlugs) as StatusLabel[]).map((label) => (
            <ButtonTab
              key={label}
              active={activeTab === label}
              onClick={() => handleTabClick(label)}
              count={`${counts[tabSlugs[label]] ?? 0}`}
              variant={label === 'Exceptions' ? 'red' : undefined}
            >
              {label}
            </ButtonTab>
          ))}
        </div>
      </div>

      {isError ? (
        <QueryError
          message={
            error instanceof Error ? error.message : 'Could not load payments.'
          }
          onRetry={() => refetch()}
        />
      ) : (
        <TableWithLoading isLoading={isFetching}>
          <RootTable
            payments={currentData}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            selectable={isReadyToPay}
            onCancelClick={handleCancelClick}
            onReRunClick={handleReRunClick}
            onCancelBulkPaymentClick={handleCancelBulkPaymentClick}
          />
        </TableWithLoading>
      )}

      <CancelPaymentModal
        open={isCancelModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
        isSubmitting={cancelPayable.isPending}
      />
      <CancelBulkPaymentModal
        open={isCancelBulkPaymentModalOpen}
        onClose={handleCancelBulkPaymentClose}
        onConfirm={handleCancelBulkPaymentConfirm}
        isSubmitting={cancelPayablesBulk.isPending}
      />
      <ReRunPaymentModal
        open={isReRunModalOpen}
        onClose={handleReRunClose}
        onConfirm={handleReRunConfirm}
      />
    </Box>
  );
};

export default BillsPayables;
