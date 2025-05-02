import { useState, useMemo } from "react";
import Box from "../../component/layout/Box";
import Pagination from "../../component/base/Pagination";
import BoxHeader from "../../component/layout/BoxHeader";
import { ButtonTab } from "../../component/base/ButtonTab";
import RootTable from "../../component/base/RootTable";
import { payments } from "./data";

const statusMap = {
  'Ready to Pay': 'unprocessed',
  'In Progress': 'processed',
  'Paid': 'paid',
  'Exceptions': 'failed'
} as const;

type StatusLabel = keyof typeof statusMap;

const BillsPayables = () => {
  const [activeTab, setActiveTab] = useState<StatusLabel>('Ready to Pay');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPayments = useMemo(
    () => payments.filter(payment => payment.status === statusMap[activeTab]),
    [activeTab]
  );

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); 
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
          const tabCount = payments.filter(d => d.status === statusMap[label]).length;

          return (
            <ButtonTab
              key={label}
              active={activeTab === label}
              onClick={() => setActiveTab(label)}
              count={`${tabCount || 0}`}
              variant={label === "Exceptions" ? "red" : undefined}
            >
              {label}
            </ButtonTab>
          );
        })}

        </div>
      </div>
      <div className="px-6 pb-4">
        <RootTable payments={currentData} />
      </div>
    </Box>
  );
};

export default BillsPayables;
