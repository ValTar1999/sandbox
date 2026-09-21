import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import Button from '../../components/common/base/Button';
import Menu from '../../components/common/base/Menu';
import MenuCloseItem from '../../components/common/base/MenuCloseItem';
import ReceivablesTable from './ReceivablesTable';
import { statusMap, Receivable, ReceivableStatus } from './data';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import CancelPaymentModal from '../../modals/CancelPaymentModal';
import ReRunPaymentModal from '../../modals/ReRunPaymentModal';
import ManageColumnsModal from '../../modals/ManageColumnsModal';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import {
  useCancelReceivable,
  useReceivables,
  useRerunReceivable,
} from '../../hooks/queries/useReceivables';
import { fetchReceivables } from '../../api/receivables';
import type {
  FilterSelections,
  FilterCategoryId,
} from '../../components/common/dropdowns/dropdownFilterUtils';
import { countSelected } from '../../components/common/dropdowns/dropdownFilterUtils';
import { RECEIVABLES_FILTER_CATEGORIES } from './filterCategories';
import {
  DEFAULT_COLUMNS_BY_TAB,
  getDefaultColumnsForTab,
  getManageColumnDefinition,
  type ReceivablesColumnConfig,
  type ReceivablesColumnId,
} from './manageColumns';
import { exportReceivables, type ExportFormat } from './exportUtils';

const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: 'csv', label: 'CSV (.csv)' },
  { format: 'json', label: 'JSON (.json)' },
  { format: 'xlsx', label: 'Excel (.xlsx)' },
  { format: 'pdf', label: 'PDF (.pdf)' },
];

const tabSlugs: Record<ReceivableStatus, string> = {
  'Ready to Invoice': 'ready-to-invoice',
  'In Progress': 'in-progress',
  Paid: 'paid',
  Exceptions: 'exceptions',
};

const serializeFilters = (filters: FilterSelections) => {
  const active = (Object.keys(filters) as FilterCategoryId[]).reduce(
    (acc, categoryId) => {
      if (
        countSelected(
          categoryId,
          filters[categoryId],
          RECEIVABLES_FILTER_CATEGORIES
        ) > 0
      ) {
        acc[categoryId] = filters[categoryId];
      }
      return acc;
    },
    {} as FilterSelections
  );

  return Object.keys(active).length > 0 ? JSON.stringify(active) : undefined;
};

const InvoicesReceivables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] =
    useState<ReceivableStatus>('Ready to Invoice');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterSelections>({});
  const [isManageColumnsOpen, setIsManageColumnsOpen] = useState(false);
  const [columnsByTab, setColumnsByTab] = useState<
    Record<ReceivableStatus, ReceivablesColumnConfig[]>
  >(DEFAULT_COLUMNS_BY_TAB);
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [receivableToCancel, setReceivableToCancel] =
    useState<Receivable | null>(null);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);

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
      <ManageColumnsModal
        open={isManageColumnsOpen}
        onClose={() => setIsManageColumnsOpen(false)}
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
    </Box>
  );
};

export default InvoicesReceivables;
