import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../../components/layout/Box';
import Pagination from '../../components/common/base/Pagination';
import BoxHeader from '../../components/layout/BoxHeader';
import VendorsTable from './VendorsTable';
import type { NetworkAction } from './VendorsTable';
import { Vendor, PaymentNetworkStatus } from './data';
import NetworkSearchInviteModal from '../../modals/NetworkSearchInviteModal';
import type { ModalStage } from '../../modals/NetworkSearchInviteModal';
import TableWithLoading from '../../components/common/base/TableWithLoading';
import QueryError from '../../components/common/base/QueryError';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useUpdateVendor, useVendors } from '../../hooks/queries/useVendors';

const Vendors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data, isFetching, isError, error, refetch } = useVendors();
  const updateVendor = useUpdateVendor();

  const filteredVendors = useMemo(() => {
    const vendors = data?.rows ?? [];
    if (!debouncedSearch.trim()) return vendors;
    const query = debouncedSearch.toLowerCase();
    return vendors.filter(
      (v) =>
        v.companyName.toLowerCase().includes(query) ||
        v.companyId.toLowerCase().includes(query)
    );
  }, [data?.rows, debouncedSearch]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVendors.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredVendors]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredVendors.length / itemsPerPage)
  );

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
    | 'inviteToNetwork'
    | 'resendInvitation'
    | 'sendLinkRequest'
    | 'resendLinkRequest'
    | 'rejectRequest'
    | 'deleteLink'
    | undefined
  >(undefined);

  const persistStatus = useCallback(
    (vendor: Vendor, status: PaymentNetworkStatus) => {
      updateVendor.mutate({ id: vendor.id, paymentNetworkStatus: status });
    },
    [updateVendor]
  );

  const handlePaymentNetworkChange = (
    vendor: Vendor,
    status: PaymentNetworkStatus
  ) => {
    persistStatus(vendor, status);
  };

  const handleNetworkAction = useCallback(
    (action: NetworkAction, vendor: Vendor) => {
      if (action.modalType === 'viewPaymentPreferences') {
        navigate('/smart-exchange/payment-preferences');
        return;
      }

      if (
        action.modalType === 'inviteToNetwork' ||
        action.modalType === 'resendInvitation' ||
        action.modalType === 'sendLinkRequest' ||
        action.modalType === 'resendLinkRequest' ||
        action.modalType === 'rejectRequest' ||
        action.modalType === 'deleteLink'
      ) {
        setActiveVendor(vendor);
        setInviteModalType(action.modalType as typeof inviteModalType);
        setInviteModalInitialStage(
          action.modalType === 'resendInvitation'
            ? 'invite'
            : action.modalType === 'sendLinkRequest' ||
                action.modalType === 'resendLinkRequest'
              ? 'linkRequest'
              : action.modalType === 'deleteLink'
                ? 'unlinkVendor'
                : action.modalType === 'rejectRequest'
                  ? 'rejectRequest'
                  : 'search'
        );
        setInviteModalOpen(true);
      }
    },
    [navigate]
  );

  const handleInviteModalClose = useCallback(() => {
    setInviteModalOpen(false);
    setActiveVendor(null);
    setInviteModalInitialStage(undefined);
    setInviteModalType(undefined);
  }, []);

  const handleInviteSent = useCallback(() => {
    if (!activeVendor) return;
    persistStatus(activeVendor, 'invitationSent');
  }, [activeVendor, persistStatus]);

  const handleLinkRequestSent = useCallback(() => {
    if (!activeVendor) return;
    persistStatus(
      activeVendor,
      activeVendor.paymentNetworkStatus === 'requestReceived'
        ? 'inNetwork'
        : 'linkRequestPending'
    );
  }, [activeVendor, persistStatus]);

  const handleReject = useCallback(() => {
    if (!activeVendor) return;
    persistStatus(activeVendor, 'rejected');
  }, [activeVendor, persistStatus]);

  const handleConfirmVendor = useCallback(() => {
    if (!activeVendor) return;
    persistStatus(activeVendor, 'inNetwork');
  }, [activeVendor, persistStatus]);

  const handleUnlink = useCallback(() => {
    if (!activeVendor) return;
    persistStatus(activeVendor, 'notInNetwork');
  }, [activeVendor, persistStatus]);

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
      {isError ? (
        <QueryError
          message={
            error instanceof Error ? error.message : 'Could not load vendors.'
          }
          onRetry={() => refetch()}
        />
      ) : (
        <TableWithLoading isLoading={isFetching}>
          <VendorsTable
            vendors={currentData}
            onPaymentNetworkChange={handlePaymentNetworkChange}
            onNetworkAction={handleNetworkAction}
          />
        </TableWithLoading>
      )}

      <NetworkSearchInviteModal
        open={inviteModalOpen}
        onClose={handleInviteModalClose}
        onConfirm={handleConfirmVendor}
        onInviteSent={handleInviteSent}
        onLinkRequestSent={handleLinkRequestSent}
        onReject={handleReject}
        onUnlink={handleUnlink}
        initialStage={inviteModalInitialStage}
        modalType={inviteModalType}
      />
    </Box>
  );
};

export default Vendors;
