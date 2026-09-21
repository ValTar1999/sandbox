import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import ReceivablesTable from './ReceivablesTable';
import { statusMap, Receivable, ReceivableStatus } from './data';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import CancelPaymentModal from '../../modals/CancelPaymentModal';
import ReRunPaymentModal from '../../modals/ReRunPaymentModal';
import {
  ExportMenu,
  ManageColumns,
  serializeFilters,
  type ExportFormat,
  type FilterSelections,
} from '../../components/common/table';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { usePersistedState } from '../../hooks/usePersistedState';
import {
  useCancelReceivable,
  useReceivables,
  useRerunReceivable,
} from '../../hooks/queries/useReceivables';
import { fetchReceivables } from '../../api/receivables';
import { RECEIVABLES_FILTER_CATEGORIES } from './filterCategories';
import {
  DEFAULT_COLUMNS_BY_TAB,
  getDefaultColumnsForTab,
  getManageColumnDefinition,
  type ReceivablesColumnConfig,
  type ReceivablesColumnId,
} from './manageColumns';
import { exportReceivables } from './exportUtils';

const STORAGE_KEYS = {
  activeTab: 'smart-hub:receivables:activeTab',
  search: 'smart-hub:receivables:search',
  filters: 'smart-hub:receivables:filters',
  columns: 'smart-hub:receivables:columns',
  perPage: 'smart-hub:receivables:perPage',
} as const;

const tabSlugs: Record<ReceivableStatus, string> = {
  'Ready to Invoice': 'ready-to-invoice',
  'In Progress': 'in-progress',
  Paid: 'paid',
  Exceptions: 'exceptions',
};

const InvoicesReceivables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = usePersistedState<ReceivableStatus>(
    STORAGE_KEYS.activeTab,
    'Ready to Invoice'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = usePersistedState(
    STORAGE_KEYS.perPage,
    10
  );
  const [searchQuery, setSearchQuery] = usePersistedState(
    STORAGE_KEYS.search,
    ''
  );
  const [filters, setFilters] = usePersistedState<FilterSelections>(
    STORAGE_KEYS.filters,
    {}
  );
  const [columnsByTab, setColumnsByTab] = usePersistedState<
    Record<ReceivableStatus, ReceivablesColumnConfig[]>
  >(STORAGE_KEYS.columns, DEFAULT_COLUMNS_BY_TAB);
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [receivableToCancel, setReceivableToCancel] =
    useState<Receivable | null>(null);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);

  const serializedFilters = useMemo(
    () => serializeFilters(filters, RECEIVABLES_FILTER_CATEGORIES),
    [filters]
  );

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

  const { data, isFetching, isError, error, refetch } =
    useReceivables(listParams);
  const cancelReceivable = useCancelReceivable();
  const rerunReceivable = useRerunReceivable();

  const currentData = data?.rows ?? [];
  const total = data?.total ?? 0;
  const counts = data?.counts ?? {};
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const activeColumns = columnsByTab[activeTab];
  const defaultColumnsForTab = getDefaultColumnsForTab(activeTab);

  const handleTabClick = (tab: ReceivableStatus) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleFilterApply = (next: FilterSelections) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleColumnsApply = (next: ReceivablesColumnConfig[]) => {
    setColumnsByTab((prev) => ({ ...prev, [activeTab]: next }));
  };

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      const all = await fetchReceivables({
        tab: tabSlugs[activeTab],
        search: debouncedSearch,
        filters: serializedFilters,
      });
      exportReceivables(all.rows, tabSlugs[activeTab], format);
    },
    [activeTab, debouncedSearch, serializedFilters]
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleInvoiceClick = (receivable: Receivable) => {
    navigate(`/receivables/${receivable.invoiceNumber}`);
  };

  const handleReRunClick = async (receivable: Receivable) => {
    try {
      await rerunReceivable.mutateAsync(receivable.id);
    } catch (error) {
      console.error('[receivables] could not re-run the invoice', error);
      return;
    }

    setIsReRunModalOpen(true);
  };

  const handleCancelClick = (receivable: Receivable) => {
    setReceivableToCancel(receivable);
  };

  const handleCancelConfirm = async () => {
    if (!receivableToCancel) return;

    try {
      await cancelReceivable.mutateAsync(receivableToCancel.id);
    } catch (error) {
      console.error('[receivables] could not cancel the invoice', error);
      return;
    }

    setReceivableToCancel(null);
  };

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="Receivables Overview"
          description={`${total} Receivables`}
          searchValue={searchQuery}
          onSearch={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          filters={filters}
          onFilterApply={handleFilterApply}
          filterCategories={RECEIVABLES_FILTER_CATEGORIES}
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
              getManageColumnDefinition(id as ReceivablesColumnId)
            }
            description="Choose which columns appear in the receivables table."
            onApply={(next) =>
              handleColumnsApply(next as ReceivablesColumnConfig[])
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
          {(Object.keys(statusMap) as ReceivableStatus[]).map((label) => (
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
            error instanceof Error
              ? error.message
              : 'Could not load receivables.'
          }
          onRetry={() => refetch()}
        />
      ) : (
        <TableWithLoading isLoading={isFetching}>
          <ReceivablesTable
            receivables={currentData}
            activeTab={activeTab}
            columns={activeColumns}
            onInvoiceClick={handleInvoiceClick}
            onReRunClick={handleReRunClick}
            onCancelClick={handleCancelClick}
          />
        </TableWithLoading>
      )}

      <CancelPaymentModal
        open={Boolean(receivableToCancel)}
        onClose={() => {
          if (cancelReceivable.isPending) return;
          setReceivableToCancel(null);
        }}
        onConfirm={handleCancelConfirm}
        isSubmitting={cancelReceivable.isPending}
      />
      <ReRunPaymentModal
        open={isReRunModalOpen}
        onClose={() => setIsReRunModalOpen(false)}
        onConfirm={() => setIsReRunModalOpen(false)}
      />
    </Box>
  );
};

export default InvoicesReceivables;
