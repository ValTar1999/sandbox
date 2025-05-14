// src/component/base/CancelPaymentModal.tsx
import React from "react";
import Icon from "../component/base/Icon";
import Button from "../component/base/Button";
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";

interface CancelPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelPaymentModal: React.FC<CancelPaymentModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <Modal
        className="w-128"
        title="Cancel Payment"
        description="Are you sure you want to cancel payment?"
        icon={<Icon icon="exclamation" className="-mb-2 -mt-4 h-11 w-11 text-red-500" />}
        onClose={onClose}
        footer={
          <div className="grid grid-cols-2 items-center gap-6">
            <Button variant="secondary" size="xl"className="w-full" onClick={onClose}>Go Back</Button>
            <Button variant="primaryDistructive" size="xl"className="w-full" onClick={onConfirm}>Cancel Payment</Button>
          </div>
        }
      />
    </LayoutModal>
  );
};

export default CancelPaymentModal;
