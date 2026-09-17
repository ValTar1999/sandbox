import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import Button from '../../components/common/base/Button';
import Menu from '../../components/common/base/Menu';
import MenuCloseItem from '../../components/common/base/MenuCloseItem';
import RootTable from '../../components/common/base/RootTable';
import type { Payment } from './data';
import CancelPaymentModal from '../../modals/CancelPaymentModal';
import CancelBulkPaymentModal from '../../modals/CancelBulkPaymentModal';
import ReRunPaymentModal from '../../modals/ReRunPaymentModal';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  useCancelPayable,
  useCancelPayablesBulk,
  usePayables,
  useRerunPayable,
} from '../../hooks/queries/usePayables';
import { fetchPayables } from '../../api/payables';
import type {
  FilterSelections,
  FilterCategoryId,
} from '../../components/common/dropdowns/dropdownFilterUtils';
import { countSelected } from '../../components/common/dropdowns/dropdownFilterUtils';
import ManageColumnsModal, {
  DEFAULT_COLUMNS_BY_TAB,
  getDefaultColumnsForTab,
  type ManageColumnConfig,
  type PayablesStatusTab,
} from '../../modals/ManageColumnsModal';
import { exportPayables, type ExportFormat } from './exportUtils';

const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: 'csv', label: 'CSV (.csv)' },
  { format: 'json', label: 'JSON (.json)' },
  { format: 'xlsx', label: 'Excel (.xlsx)' },
  { format: 'pdf', label: 'PDF (.pdf)' },
];

/** Tab labels map to the slugs the backend filters by. */
const tabSlugs = {
  'Ready to Pay': 'ready-to-pay',
  'In Progress': 'in-progress',
  Paid: 'paid',
  Exceptions: 'exceptions',
} as const;

type StatusLabel = PayablesStatusTab;

const serializeFilters = (filters: FilterSelections) => {
  const active = (Object.keys(filters) as FilterCategoryId[]).reduce(
    (acc, categoryId) => {
      if (countSelected(categoryId, filters[categoryId]) > 0) {
        acc[categoryId] = filters[categoryId];
      }
      return acc;
    },
    {} as FilterSelections
  );

  return Object.keys(active).length > 0 ? JSON.stringify(active) : undefined;
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterSelections>({});
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
  const [columnsByTab, setColumnsByTab] = useState<
    Record<StatusLabel, ManageColumnConfig[]>
  >(DEFAULT_COLUMNS_BY_TAB);
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
          onDeselect={() => setSelectedIds([])}
          onPay={() => {
            if (selectedIds.length > 0) {
              navigate('/payables/multiple', { state: { selectedIds } });
            }
          }}
        >
          <Menu.Root placement="bottom-start">
            <Menu.Trigger asChild>
              <Button
                size="md"
                variant="secondary"
                icon="arrow-up-tray"
                iconDirection="right"
              >
                Export
              </Button>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className="z-50">
                <Menu.Popup className="min-w-20 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-dropdown">
                  {EXPORT_OPTIONS.map(({ format, label }) => (
                    <MenuCloseItem
                      key={format}
                      className="px-4 py-2.5 text-sm leading-5 font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        void handleExport(format);
                      }}
                    >
                      {label}
                    </MenuCloseItem>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
          <Button
            size="md"
            variant="secondary"
            icon="adjustments-horizontal"
            iconVariant="outline"
            title="Manage columns"
            onClick={() => setIsManageColumnsOpen(true)}
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
      <ManageColumnsModal
        open={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
        value={activeColumns}
        defaultColumns={defaultColumnsForTab}
        onApply={handleColumnsApply}
      />
    </Box>
  );
};

export default BillsPayables;
