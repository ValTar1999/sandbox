import { useState, useMemo, useEffect, useCallback } from 'react';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import Button from '../../components/common/base/Button';
import { ButtonTab } from '../../components/common/base/ButtonTab';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import { LOADING_DURATION_MS } from '../../constants/animations';
import SmartExchangePaymentsTable from './SmartExchangePaymentsTable';
import { smartExchangePayments, type SmartExchangeTab } from './data';
import {
  SMART_EXCHANGE_TAB_LABELS,
  SMART_EXCHANGE_TAB_TITLES,
} from './constants';
import { exportPaymentsToCsv } from './utils';

const SmartExchange = () => {
  const [activeTab, setActiveTab] = useState<SmartExchangeTab>('pending');
  const [nextTab, setNextTab] = useState<SmartExchangeTab | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [nextItemsPerPage, setNextItemsPerPage] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading || !nextTab) return;

    const timeout = setTimeout(() => {
      setActiveTab(nextTab);
      setCurrentPage(1);
      setNextTab(null);
      setIsLoading(false);
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [isLoading, nextTab]);

  useEffect(() => {
    if (nextPage === null && nextItemsPerPage === null) return;

    const timeout = setTimeout(() => {
      if (nextPage !== null) {
        setCurrentPage(nextPage);
        setNextPage(null);
      }
      if (nextItemsPerPage !== null) {
        setItemsPerPage(nextItemsPerPage);
        setCurrentPage(1);
        setNextItemsPerPage(null);
      }
      setIsLoading(false);
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [nextPage, nextItemsPerPage]);

  const tabCounts = useMemo(() => {
    const counts: Record<SmartExchangeTab, number> = {
      pending: 0,
      paid: 0,
      exceptions: 0,
    };
    for (const row of smartExchangePayments) {
      counts[row.tab] += 1;
    }
    return counts;
  }, []);

  const handleTabClick = useCallback(
    (tab: SmartExchangeTab) => {
      if (tab === activeTab) return;
      setIsLoading(true);
      setNextTab(tab);
    },
    [activeTab]
  );

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return smartExchangePayments.filter((row) => {
      if (row.tab !== activeTab) return false;
      if (!query) return true;
      return (
        row.invoiceNumber.toLowerCase().includes(query) ||
        row.vendorEntry.toLowerCase().includes(query) ||
        row.customer.toLowerCase().includes(query)
      );
    });
  }, [activeTab, searchQuery]);

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredRows]);

  const totalPages = useMemo(
    () => Math.ceil(filteredRows.length / itemsPerPage),
    [filteredRows.length, itemsPerPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage) return;
      setIsLoading(true);
      setNextPage(page);
    },
    [currentPage]
  );

  const handleItemsPerPageChange = useCallback(
    (items: number) => {
      if (items === itemsPerPage) return;
      setIsLoading(true);
      setNextItemsPerPage(items);
    },
    [itemsPerPage]
  );

  const handleExport = useCallback(() => {
    exportPaymentsToCsv(filteredRows, activeTab);
  }, [filteredRows, activeTab]);

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="SMART Exchange Overview"
          description={`${filteredRows.length} Payments`}
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
            totalItems={filteredRows.length}
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
              count={`${tabCounts[tab]}`}
              variant={tab === 'exceptions' ? 'red' : undefined}
            >
              {SMART_EXCHANGE_TAB_TITLES[tab]}
            </ButtonTab>
          ))}
        </div>
      </div>

      <TableWithLoading isLoading={isLoading}>
        <SmartExchangePaymentsTable payments={currentData} />
      </TableWithLoading>
    </Box>
  );
};

export default SmartExchange;
