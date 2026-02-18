import React from "react";
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";

interface UnsupportedBulkPaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onChangePaymentMethod?: () => void;
  onDiscard?: () => void;
  isUnsupportedMethod?: boolean;
}

const UnsupportedBulkPaymentMethodModal: React.FC<UnsupportedBulkPaymentMethodModalProps> = ({
  open,
  onClose,
  onChangePaymentMethod,
  onDiscard,
  isUnsupportedMethod = false,
}) => {
  if (!open) return null;

  const handleChangePaymentMethod = () => {
    onChangePaymentMethod?.();
  };

  const handleDiscard = () => {
    onDiscard?.();
  };

  const warningIcon = (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 mt-6 -mb-2">
      <Icon icon="exclamation" variant="outline" className="h-6 w-6 text-yellow-500" />
    </div>
  );

  if (isUnsupportedMethod) {
    return (
      <LayoutModal>
        <Modal
          className="w-128"
          title="Unsupported Bulk Payment Method"
          description="You've chosen a payment method that is not currently available for bulk payments. Bulk payments are supported only for <strong class='text-gray-900'>ACH</strong>, <strong class='text-gray-900'>RTP</strong>, and <strong class='text-gray-900'>SMART Exchange</strong> methods."
          icon={warningIcon}
          footer={
            <div className="flex items-center justify-start gap-4">
              <Button size="md" onClick={handleChangePaymentMethod}>
                Change Payment Method
              </Button>
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
            </div>
          }
        />
      </LayoutModal>
    );
  }

  return (
    <LayoutModal>
      <Modal
        className="w-128"
        title="Are you sure you want to discard this information?"
        description="If you discard this information, any progress or changes you've made will be lost. Please ensure that you've saved any important changes before proceeding."
          icon={warningIcon}
          footer={
          <div className="flex items-center justify-start gap-4">
            <Button variant="primary" size="md" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        }
      />
    </LayoutModal>
  );
};

export default UnsupportedBulkPaymentMethodModal;
