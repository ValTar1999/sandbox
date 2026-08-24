// src/components/common/base/CancelPaymentModal.tsx
import React from 'react';
import Icon from '../components/common/base/Icon';
import Button from '../components/common/base/Button';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';

interface CancelPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const CancelPaymentModal: React.FC<CancelPaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  return (
    <LayoutModal open={open}>
      <Modal
        className="w-128"
        titleCenter={true}
        title="Cancel Payment"
        description="Are you sure you want to cancel payment?"
        icon={
          <Icon
            icon="exclamation"
            className="-mb-2 -mt-4 h-11 w-11 text-red-500"
          />
        }
        onClose={onClose}
        footer={
          <div className="grid grid-cols-2 items-center gap-6">
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Go Back
            </Button>
            <Button
              variant="primaryDistructive"
              size="xl"
              className="w-full"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              Cancel Payment
            </Button>
          </div>
        }
      />
    </LayoutModal>
  );
};

export default CancelPaymentModal;
