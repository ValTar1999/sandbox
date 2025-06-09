import { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import Box from "../../component/layout/Box";
import Pagination from "../../component/base/Pagination";
import BoxHeader from "../../component/layout/BoxHeader";
import { ButtonTab } from "../../component/base/ButtonTab";
import RootTable from "../../component/base/RootTable";
import { payments } from "./data";
import CancelPaymentModal from "../../modals/CancelPaymentModal";
import ReRunPaymentModal from "../../modals/ReRunPaymentModal";
import Loading from "../../component/base/Loading";

const statusMap = {
  'Ready to Pay': 'unprocessed',
  'In Progress': ['processed', 'pastDue'],
  'Paid': 'paid',
  'Exceptions': 'failed'
} as const;

type StatusLabel = keyof typeof statusMap;

const BillsPayables = () => {
  const [activeTab, setActiveTab] = useState<StatusLabel>('Ready to Pay');
  const [nextTab, setNextTab] = useState<StatusLabel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReRunModalOpen, setIsReRunModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);

  useEffect(() => {
    if (!isLoading || !nextTab) return;

    const timeout = setTimeout(() => {
      setActiveTab(nextTab);
      setNextTab(null);
      setIsLoading(false);
    }, 1000); // время исчезновения

    return () => clearTimeout(timeout);
  }, [isLoading, nextTab]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleCancelClick = (payment: typeof payments[0]) => {
    setSelectedPayment(payment);
    setIsCancelModalOpen(true);
  };

  const handleReRunClick = (payment: typeof payments[0]) => {
    setSelectedPayment(payment);
    setIsReRunModalOpen(true);
  };

  const handleCancelConfirm = () => {
    console.log('Cancelling payment:', selectedPayment);
    setIsCancelModalOpen(false);
    setSelectedPayment(null);
  };

  const handleReRunConfirm = () => {
    console.log('Re-running payment:', selectedPayment);
    setIsReRunModalOpen(false);
    setSelectedPayment(null);
  };

  const handleCancelClose = () => {
    setIsCancelModalOpen(false);
    setSelectedPayment(null);
  };

  const handleReRunClose = () => {
    setIsReRunModalOpen(false);
    setSelectedPayment(null);
  };

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={<BoxHeader />}
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
          {(Object.keys(statusMap) as StatusLabel[]).map(label => {
            const status = statusMap[label];
            const tabCount = payments.filter(d =>
              Array.isArray(status) ? status.includes(d.status) : d.status === status
            ).length;

            return (
              <ButtonTab
                key={label}
                active={activeTab === label}
                onClick={() => handleTabClick(label)}
                count={`${tabCount || 0}`}
                variant={label === "Exceptions" ? "red" : undefined}
              >
                {label}
              </ButtonTab>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-fit">        
        <div
          className={clsx(
            "transition-opacity duration-500 ease-in-out",
            isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <RootTable
            payments={currentData}
            onCancelClick={handleCancelClick}
            onReRunClick={handleReRunClick}
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8 absolute inset-0">
            <Loading />
          </div>
        )}
      </div>

      <CancelPaymentModal
        open={isCancelModalOpen}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
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
