import React from "react";
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";

interface CancelBulkPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelBulkPaymentModal: React.FC<CancelBulkPaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <LayoutModal>
      <Modal
        className="w-128"
        titleCenter={true}
        title="Cancel Bulk Payment"
        description={`This payable is being processed as part of a <strong class="text-gray-900">bulk payment</strong>. Are you sure you want to cancel the entire bulk payment?`}
        icon={<Icon icon="exclamation" className="-mb-2 -mt-4 h-11 w-11 text-red-500" />}
        onClose={onClose}
      >
        <div className="flex flex-col gap-3 w-full -mt-2">
          <Button variant="primaryDistructive" size="xl" className="w-full" onClick={onConfirm}>
            Cancel Bulk Payment
          </Button>
          <Button variant="secondary" size="xl" className="w-full" onClick={onClose}>
            Go back
          </Button>
        </div>
      </Modal>
    </LayoutModal>
  );
};

export default CancelBulkPaymentModal;
