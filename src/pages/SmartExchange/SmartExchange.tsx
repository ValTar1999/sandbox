import { useState, useMemo, useCallback } from 'react';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
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
  useMarkPaymentPaid,
  useSmartExchangePayments,
} from '../../hooks/queries/useSmartExchange';
import { fetchSmartExchangePayments } from '../../api/smartExchange';
import SmartExchangePaymentsTable from './SmartExchangePaymentsTable';
import { type SmartExchangeTab } from './data';
import {
  SMART_EXCHANGE_TAB_LABELS,
  SMART_EXCHANGE_TAB_TITLES,
} from './constants';
import { exportPayments } from './utils';
import { SMART_EXCHANGE_FILTER_CATEGORIES } from './filterCategories';
import {
  DEFAULT_COLUMNS_BY_TAB,
  getDefaultColumnsForTab,
  getManageColumnDefinition,
  type SmartExchangeColumnConfig,
  type SmartExchangeColumnId,
} from './manageColumns';

const STORAGE_KEYS = {
  activeTab: 'smart-hub:smart-exchange:activeTab',
  search: 'smart-hub:smart-exchange:search',
  filters: 'smart-hub:smart-exchange:filters',
  columns: 'smart-hub:smart-exchange:columns',
  perPage: 'smart-hub:smart-exchange:perPage',
} as const;

const EMPTY_COUNTS: Record<SmartExchangeTab, number> = {
  pending: 0,
  paid: 0,
  exceptions: 0,
};

const SmartExchange = () => {
  const [activeTab, setActiveTab] = usePersistedState<SmartExchangeTab>(
    STORAGE_KEYS.activeTab,
    'pending'
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
    Record<SmartExchangeTab, SmartExchangeColumnConfig[]>
  >(STORAGE_KEYS.columns, DEFAULT_COLUMNS_BY_TAB);
  const debouncedSearch = useDebouncedValue(searchQuery);
  const serializedFilters = useMemo(
    () => serializeFilters(filters, SMART_EXCHANGE_FILTER_CATEGORIES),
    [filters]
  );

  const listParams = useMemo(
    () => ({
      tab: activeTab,
      search: debouncedSearch,
      filters: serializedFilters,
      page: currentPage,
      perPage: itemsPerPage,
    }),
    [activeTab, debouncedSearch, serializedFilters, currentPage, itemsPerPage]
  );

  const { data, isFetching, isError, error, refetch } =
    useSmartExchangePayments(listParams);
  const markPaid = useMarkPaymentPaid();

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const counts = data?.counts ?? EMPTY_COUNTS;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const activeColumns = columnsByTab[activeTab];
  const defaultColumnsForTab = getDefaultColumnsForTab(activeTab);

  const handleTabClick = useCallback(
    (tab: SmartExchangeTab) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
      setCurrentPage(1);
    },
    [activeTab, setActiveTab]
  );

  const handleFilterApply = (next: FilterSelections) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleColumnsApply = (next: SmartExchangeColumnConfig[]) => {
    setColumnsByTab((prev) => ({ ...prev, [activeTab]: next }));
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback(
    (items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1);
    },
    [setItemsPerPage]
  );

  const handleMarkPaid = useCallback(
    (paymentId: string) => markPaid.mutateAsync(paymentId),
    [markPaid]
  );

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      const all = await fetchSmartExchangePayments({
        tab: activeTab,
        search: debouncedSearch,
        filters: serializedFilters,
      });
      exportPayments(all.rows, activeTab, format);
    },
    [activeTab, debouncedSearch, serializedFilters]
  );

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="SMART Exchange Overview"
          description={`${total} Payments`}
          searchValue={searchQuery}
          onSearch={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          filters={filters}
          onFilterApply={handleFilterApply}
          filterCategories={SMART_EXCHANGE_FILTER_CATEGORIES}
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
              getManageColumnDefinition(id as SmartExchangeColumnId)
            }
            description="Choose which columns appear in the SMART Exchange table."
            onApply={(next) =>
              handleColumnsApply(next as SmartExchangeColumnConfig[])
            }
          />
        </BoxHeader>
      }
      footer={
        <div className="flex w-full justify-end">
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
          {SMART_EXCHANGE_TAB_LABELS.map((tab) => (
            <ButtonTab
              key={tab}
              active={activeTab === tab}
              onClick={() => handleTabClick(tab)}
              count={`${counts[tab]}`}
              variant={tab === 'exceptions' ? 'red' : undefined}
            >
              {SMART_EXCHANGE_TAB_TITLES[tab]}
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
          <SmartExchangePaymentsTable
            payments={rows}
            columns={activeColumns}
            onMarkPaid={handleMarkPaid}
          />
        </TableWithLoading>
      )}
    </Box>
  );
};

export default SmartExchange;
