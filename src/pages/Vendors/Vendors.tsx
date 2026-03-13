import { useState, useMemo } from "react";
import Box from "../../component/layout/Box";
import Pagination from "../../component/base/Pagination";
import BoxHeader from "../../component/layout/BoxHeader";
import VendorsTable from "./VendorsTable";
import { vendors as vendorsData, Vendor, PaymentNetworkStatus } from "./data";

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [vendors, setVendors] = useState<Vendor[]>(vendorsData);

  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors;
    const query = searchQuery.toLowerCase();
    return vendors.filter(
      (v) =>
        v.companyName.toLowerCase().includes(query) ||
        v.companyId.toLowerCase().includes(query)
    );
  }, [vendors, searchQuery]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVendors.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredVendors]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handlePaymentNetworkChange = (vendor: Vendor, status: PaymentNetworkStatus) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendor.id ? { ...v, paymentNetworkStatus: status } : v
      )
    );
  };

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="Vendors"
          description={`${filteredVendors.length} companies`}
          onSearch={setSearchQuery}
        />
      }
      footer={
        <div className="w-full flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredVendors.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      }
    >
      <VendorsTable
        vendors={currentData}
        onPaymentNetworkChange={handlePaymentNetworkChange}
      />
    </Box>
  );
};

export default Vendors;
