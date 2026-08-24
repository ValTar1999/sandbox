import { useState, useMemo, useCallback } from 'react';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import Button from '../../components/common/base/Button';
import { ButtonTab } from '../../components/common/base/ButtonTab';
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
import { exportPaymentsToCsv } from './utils';

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
  const handleExport = useCallback(async () => {
    const all = await fetchSmartExchangePayments({
      tab: activeTab,
      search: debouncedSearch,
    });
    exportPaymentsToCsv(all.rows, activeTab);
  }, [activeTab, debouncedSearch]);

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="SMART Exchange Overview"
          description={`${total} Payments`}
          onSearch={setSearchQuery}
        >
          <Button
            size="lg"
            variant="secondary"
            icon="arrow-up-tray"
            iconDirection="right"
            onClick={handleExport}
          >
            Export
          </Button>
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
