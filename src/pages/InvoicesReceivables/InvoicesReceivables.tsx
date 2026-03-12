import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "../../component/layout/Box";
import Pagination from "../../component/base/Pagination";
import BoxHeader from "../../component/layout/BoxHeader";
import { ButtonTab } from "../../component/base/ButtonTab";
import ReceivablesTable from "./ReceivablesTable";
import {
  receivables,
  statusMap,
  Receivable,
  ReceivableStatus,
  PaymentMethodItem,
} from "./data";
import TableWithLoading from "../../component/base/TableWithLoading";
import { LOADING_DURATION_MS } from "../../constants/animations";

const InvoicesReceivables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReceivableStatus>("Ready to Invoice");
  const [nextTab, setNextTab] = useState<ReceivableStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

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

  const tabCounts = useMemo(() => {
    const labels = Object.keys(statusMap) as ReceivableStatus[];
    const counts = {} as Record<ReceivableStatus, number>;

    labels.forEach((label) => {
      const status = statusMap[label];
      counts[label] = receivables.reduce((acc, rec) => {
        const matches = Array.isArray(status)
          ? status.includes(rec.status)
          : rec.status === status;
        return acc + (matches ? 1 : 0);
      }, 0);
    });

    return counts;
  }, []);

  const handleTabClick = (tab: ReceivableStatus) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setNextTab(tab);
  };

  const filteredReceivables = useMemo(() => {
    const status = statusMap[activeTab];
    let result = receivables.filter((rec) =>
      Array.isArray(status) ? status.includes(rec.status) : rec.status === status
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (rec) =>
          rec.invoiceNumber.toLowerCase().includes(query) ||
          rec.customer.toLowerCase().includes(query) ||
          rec.amount.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredReceivables.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredReceivables]);

  const totalPages = useMemo(
    () => Math.ceil(filteredReceivables.length / itemsPerPage),
    [filteredReceivables.length, itemsPerPage]
  );

  const [nextPage, setNextPage] = useState<number | null>(null);
  const [nextItemsPerPage, setNextItemsPerPage] = useState<number | null>(null);

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

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setNextPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    if (items === itemsPerPage) return;
    setIsLoading(true);
    setNextItemsPerPage(items);
  };

  const handleInvoiceClick = (receivable: Receivable) => {
    navigate(`/receivables/${receivable.id}`);
  };

  const handleReRunClick = (receivable: Receivable) => {
    console.log("Re-run clicked:", receivable);
    // TODO: Re-run payment
  };

  const handleCancelClick = (
    receivable: Receivable,
    paymentMethod?: PaymentMethodItem
  ) => {
    console.log("Cancel clicked:", receivable, paymentMethod);
    // TODO: Cancel payment
  };

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="Receivables Overview"
          description={`${filteredReceivables.length} Receivables`}
          onSearch={setSearchQuery}
        />
      }
      footer={
        <div className="w-full flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredReceivables.length}
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
              count={`${tabCounts[label] || 0}`}
              variant={label === "Exceptions" ? "red" : undefined}
            >
              {label}
            </ButtonTab>
          ))}
        </div>
      </div>

      <TableWithLoading isLoading={isLoading}>
        <ReceivablesTable
          receivables={currentData}
          activeTab={activeTab}
          onInvoiceClick={handleInvoiceClick}
          onReRunClick={handleReRunClick}
          onCancelClick={handleCancelClick}
        />
      </TableWithLoading>
    </Box>
  );
};

export default InvoicesReceivables;
