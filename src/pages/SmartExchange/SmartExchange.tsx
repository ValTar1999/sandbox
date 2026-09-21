import { useState, useMemo, useCallback } from 'react';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import Button from '../../components/common/base/Button';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import Menu from '../../components/common/base/Menu';
import MenuCloseItem from '../../components/common/base/MenuCloseItem';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
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
import { exportPayments, type ExportFormat } from './utils';

const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: 'csv', label: 'CSV (.csv)' },
  { format: 'json', label: 'JSON (.json)' },
  { format: 'xlsx', label: 'Excel (.xlsx)' },
  { format: 'pdf', label: 'PDF (.pdf)' },
];

const EMPTY_COUNTS: Record<SmartExchangeTab, number> = {
  pending: 0,
  paid: 0,
  exceptions: 0,
};

const SmartExchange = () => {
  const [activeTab, setActiveTab] = useState<SmartExchangeTab>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);

  const listParams = useMemo(
    () => ({
      tab: activeTab,
      search: debouncedSearch,
      page: currentPage,
      perPage: itemsPerPage,
    }),
    [activeTab, debouncedSearch, currentPage, itemsPerPage]
  );

  const { data, isFetching, isError, error, refetch } =
    useSmartExchangePayments(listParams);
  const markPaid = useMarkPaymentPaid();

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const counts = data?.counts ?? EMPTY_COUNTS;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  const handleTabClick = useCallback(
    (tab: SmartExchangeTab) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
      setCurrentPage(1);
    },
    [activeTab]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  const handleMarkPaid = useCallback(
    (paymentId: string) => markPaid.mutateAsync(paymentId),
    [markPaid]
  );

  // The export covers every matching row, not just the visible page, so it
  // asks the backend for the unpaginated set.
  const handleExport = useCallback(
    async (format: ExportFormat) => {
      const all = await fetchSmartExchangePayments({
        tab: activeTab,
        search: debouncedSearch,
      });
      exportPayments(all.rows, activeTab, format);
    },
    [activeTab, debouncedSearch]
  );

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="SMART Exchange Overview"
          description={`${total} Payments`}
          searchValue={searchQuery}
          showFilter={false}
          onSearch={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
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
            onMarkPaid={handleMarkPaid}
          />
        </TableWithLoading>
      )}
    </Box>
  );
};

export default SmartExchange;
