import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "../../components/layout/Box";
import Pagination from "../../components/common/base/Pagination";
import BoxHeader from "../../components/layout/BoxHeader";
import { ButtonTab } from "../../components/common/base/ButtonTab";
import RootTable from "../../components/common/base/RootTable";
import { payments } from "./data";
import CancelPaymentModal from "../../modals/CancelPaymentModal";
import CancelBulkPaymentModal from "../../modals/CancelBulkPaymentModal";
import ReRunPaymentModal from "../../modals/ReRunPaymentModal";
import TableWithLoading from "../../components/common/base/TableWithLoading";
import { LOADING_DURATION_MS } from "../../constants/animations";

const statusMap = {
  'Ready to Pay': 'unprocessed',
  'In Progress': ['processed', 'pastDue'],
  'Paid': 'paid',
  'Exceptions': 'failed'
} as const;

type StatusLabel = keyof typeof statusMap;

const BillsPayables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusLabel>('Ready to Pay');
  const [nextTab, setNextTab] = useState<StatusLabel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelBulkPaymentModalOpen, setIsCancelBulkPaymentModalOpen] = useState(false);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    const labels = Object.keys(statusMap) as StatusLabel[];
    const counts = {} as Record<StatusLabel, number>;

    labels.forEach((label) => {
      const status = statusMap[label];
      counts[label] = payments.reduce((acc, payment) => {
        const matches = Array.isArray(status)
          ? status.includes(payment.status)
          : payment.status === status;
        return acc + (matches ? 1 : 0);
      }, 0);
    });

    return counts;
  }, []);

  const handleTabClick = (tab: StatusLabel) => {
    if (tab === activeTab) return;
    setIsLoading(true);
    setNextTab(tab);
  };

  const filteredPayments = useMemo(() => {
    const status = statusMap[activeTab];
    return payments.filter(payment =>
      Array.isArray(status) ? status.includes(payment.status) : payment.status === status
    );
  }, [activeTab]);

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, filteredPayments]);

  const totalPages = useMemo(
    () => Math.ceil(filteredPayments.length / itemsPerPage),
    [filteredPayments.length, itemsPerPage]
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleCancelClick = (payment: typeof payments[0]) => {
    void payment;
    setIsCancelModalOpen(true);
  };

  const handleReRunClick = (payment: typeof payments[0]) => {
    void payment;
    setIsReRunModalOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsCancelModalOpen(false);
  };

  const handleReRunConfirm = () => {
    setIsReRunModalOpen(false);
  };

  const handleCancelClose = () => {
    setIsCancelModalOpen(false);
  };

  const handleCancelBulkPaymentClick = (payment: typeof payments[0]) => {
    void payment;
    setIsCancelBulkPaymentModalOpen(true);
  };

  const handleCancelBulkPaymentConfirm = () => {
    setIsCancelBulkPaymentModalOpen(false);
  };

  const handleCancelBulkPaymentClose = () => {
    setIsCancelBulkPaymentModalOpen(false);
  };

  const handleReRunClose = () => {
    setIsReRunModalOpen(false);
  };

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          description={`${filteredPayments.length} Payments`}
          selectedCount={selectedIds.length}
          onDeselect={() => setSelectedIds([])}
          onPay={() => {
            if (selectedIds.length > 0) {
              navigate("/payables/multiple", { state: { selectedIds } });
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
            totalItems={filteredPayments.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      }
    >
      <div className="px-6 py-4">
        <div className="flex gap-9">
          {(Object.keys(statusMap) as StatusLabel[]).map(label => (
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
        <RootTable
          payments={currentData}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onCancelClick={handleCancelClick}
          onReRunClick={handleReRunClick}
          onCancelBulkPaymentClick={handleCancelBulkPaymentClick}
        />
      </TableWithLoading>

      <CancelPaymentModal
        open={isCancelModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
      />
      <CancelBulkPaymentModal
        open={isCancelBulkPaymentModalOpen}
        onClose={handleCancelBulkPaymentClose}
        onConfirm={handleCancelBulkPaymentConfirm}
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
