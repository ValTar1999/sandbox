import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import RootTable from '../../components/common/base/RootTable';
import {
  ExportMenu,
  ManageColumns,
  serializeFilters,
  PAYABLES_FILTER_CATEGORIES,
  type ExportFormat,
  type FilterSelections,
} from '../../components/common/table';
import type { Payment } from './data';
import CancelPaymentModal from '../../modals/CancelPaymentModal';
import CancelBulkPaymentModal from '../../modals/CancelBulkPaymentModal';
import ReRunPaymentModal from '../../modals/ReRunPaymentModal';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { usePersistedState } from '../../hooks/usePersistedState';
import {
  useCancelPayable,
  useCancelPayablesBulk,
  usePayables,
  useRerunPayable,
} from '../../hooks/queries/usePayables';
import { fetchPayables } from '../../api/payables';
import {
  DEFAULT_COLUMNS_BY_TAB,
  getDefaultColumnsForTab,
  getManageColumnDefinition,
  type ManageColumnConfig,
  type ManageColumnId,
  type PayablesStatusTab,
} from './manageColumns';
import { exportPayables } from './exportUtils';

const STORAGE_KEYS = {
  activeTab: 'smart-hub:payables:activeTab',
  search: 'smart-hub:payables:search',
  filters: 'smart-hub:payables:filters',
  columns: 'smart-hub:payables:columns',
  perPage: 'smart-hub:payables:perPage',
} as const;

/** Tab labels map to the slugs the backend filters by. */
const tabSlugs = {
  'Ready to Pay': 'ready-to-pay',
  'In Progress': 'in-progress',
  Paid: 'paid',
  Exceptions: 'exceptions',
} as const;

type StatusLabel = PayablesStatusTab;

const BillsPayables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = usePersistedState<StatusLabel>(
    STORAGE_KEYS.activeTab,
    'Ready to Pay'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = usePersistedState(
    STORAGE_KEYS.perPage,
    10
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelBulkPaymentModalOpen, setIsCancelBulkPaymentModalOpen] =
    useState(false);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = usePersistedState(
    STORAGE_KEYS.search,
    ''
  );
  const [filters, setFilters] = usePersistedState<FilterSelections>(
    STORAGE_KEYS.filters,
    {}
  );
  const [columnsByTab, setColumnsByTab] = usePersistedState<
    Record<StatusLabel, ManageColumnConfig[]>
  >(STORAGE_KEYS.columns, DEFAULT_COLUMNS_BY_TAB);
  const debouncedSearch = useDebouncedValue(searchQuery);

  const [paymentToCancel, setPaymentToCancel] = useState<Payment | null>(null);
  const [bulkPaymentToCancel, setBulkPaymentToCancel] =
    useState<Payment | null>(null);

  const serializedFilters = useMemo(() => serializeFilters(filters), [filters]);

  const listParams = useMemo(
    () => ({
      tab: tabSlugs[activeTab],
      search: debouncedSearch,
      filters: serializedFilters,
      page: currentPage,
      perPage: itemsPerPage,
    }),
    [activeTab, debouncedSearch, serializedFilters, currentPage, itemsPerPage]
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterApply = (next: FilterSelections) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleColumnsApply = (next: ManageColumnConfig[]) => {
    setColumnsByTab((prev) => ({ ...prev, [activeTab]: next }));
  };

  // Export covers every matching row, not just the visible page.
  const handleExport = useCallback(
    async (format: ExportFormat) => {
      const all = await fetchPayables({
        tab: tabSlugs[activeTab],
        search: debouncedSearch,
        filters: serializedFilters,
      });
      exportPayables(all.rows, tabSlugs[activeTab], format);
    },
    [activeTab, debouncedSearch, serializedFilters]
  );

  const activeColumns = columnsByTab[activeTab];
  const defaultColumnsForTab = getDefaultColumnsForTab(activeTab);

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
          searchValue={searchQuery}
          onSearch={handleSearch}
          filters={filters}
          onFilterApply={handleFilterApply}
          filterCategories={PAYABLES_FILTER_CATEGORIES}
          onDeselect={() => setSelectedIds([])}
          onPay={() => {
            if (selectedIds.length > 0) {
              navigate('/payables/multiple', { state: { selectedIds } });
            }
          }}
        >
          <ExportMenu
            onExport={(format) => {
              void handleExport(format);
            }}
          />
          <ManageColumns
            value={activeColumns}
            defaultColumns={defaultColumnsForTab}
            getColumnDefinition={(id) =>
              getManageColumnDefinition(id as ManageColumnId)
            }
            description="Choose which columns appear in the payments table."
            onApply={(next) =>
              handleColumnsApply(next as ManageColumnConfig[])
            }
          />
        </BoxHeader>
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
            columns={activeColumns}
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
