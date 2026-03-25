import { useState, useMemo, useCallback } from "react";
import Box from "../../components/layout/Box";
import Pagination from "../../components/common/base/Pagination";
import BoxHeader from "../../components/layout/BoxHeader";
import VendorsTable from "./VendorsTable";
import type { NetworkAction } from "./VendorsTable";
import { vendors as vendorsData, Vendor, PaymentNetworkStatus } from "./data";
import NetworkSearchInviteModal from "../../modals/NetworkSearchInviteModal";
import type { ModalStage } from "../../modals/NetworkSearchInviteModal";

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

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeVendor, setActiveVendor] = useState<Vendor | null>(null);
  const [inviteModalInitialStage, setInviteModalInitialStage] = useState<
    ModalStage | undefined
  >(undefined);
  const [inviteModalType, setInviteModalType] = useState<
    | "inviteToNetwork"
    | "resendInvitation"
    | "sendLinkRequest"
    | "resendLinkRequest"
    | "rejectRequest"
    | "deleteLink"
    | undefined
  >(undefined);

  const handlePaymentNetworkChange = (vendor: Vendor, status: PaymentNetworkStatus) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendor.id ? { ...v, paymentNetworkStatus: status } : v
      )
    );
  };

  const handleNetworkAction = useCallback(
    (action: NetworkAction, vendor: Vendor) => {
      if (
        action.modalType === "inviteToNetwork" ||
        action.modalType === "resendInvitation" ||
        action.modalType === "sendLinkRequest" ||
        action.modalType === "resendLinkRequest" ||
        action.modalType === "rejectRequest" ||
        action.modalType === "deleteLink"
      ) {
        setActiveVendor(vendor);
        setInviteModalType(action.modalType as typeof inviteModalType);
        setInviteModalInitialStage(
          action.modalType === "resendInvitation"
            ? "invite"
            : action.modalType === "sendLinkRequest" ||
                action.modalType === "resendLinkRequest"
              ? "linkRequest"
              : action.modalType === "deleteLink"
                ? "unlinkVendor"
              : action.modalType === "rejectRequest"
                ? "rejectRequest"
              : "search"
        );
        setInviteModalOpen(true);
      }
    },
    []
  );

  const handleInviteModalClose = useCallback(() => {
    setInviteModalOpen(false);
    setActiveVendor(null);
    setInviteModalInitialStage(undefined);
    setInviteModalType(undefined);
  }, []);

  const handleInviteSent = useCallback(() => {
    if (activeVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === activeVendor.id
            ? { ...v, paymentNetworkStatus: "invitationSent" as PaymentNetworkStatus }
            : v
        )
      );
    }
  }, [activeVendor]);

  const handleUnlink = useCallback(() => {
    if (activeVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === activeVendor.id
            ? { ...v, paymentNetworkStatus: "notInNetwork" as PaymentNetworkStatus }
            : v
        )
      );
    }
  }, [activeVendor]);

  return (
    <Box
      className="max-w-9xl mx-auto"
      header={
        <BoxHeader
          title="Vendors"
          description={`${filteredVendors.length} companies`}
          onSearch={setSearchQuery}
          showFilter={false}
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
        onNetworkAction={handleNetworkAction}
      />

      <NetworkSearchInviteModal
        open={inviteModalOpen}
        onClose={handleInviteModalClose}
        onInviteSent={handleInviteSent}
        onUnlink={handleUnlink}
        initialStage={inviteModalInitialStage}
        modalType={inviteModalType}
      />
    </Box>
  );
};

export default Vendors;
