import React from "react";
import LayoutModal from "../components/common/modal/LayoutModal";
import Modal from "../components/common/modal/Modal";
import Button from "../components/common/base/Button";
import Icon from "../components/common/base/Icon";

interface ValidationErrorModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  open,
  onClose,
  message = "Please fill in all required fields: Customer Details, Receiving Account, Payment Workflow, and Accounts on File.",
}) => {
  if (!open) return null;

  return (
    <LayoutModal>
      <Modal
        className="w-128"
        title="Validation Error"
        description={message}
        icon={
          <Icon
            icon="exclamation-circle"
            className="h-11 w-11 text-red-500"
          />
        }
        onClose={onClose}
        footer={
          <div className="flex justify-end">
            <Button size="lg" onClick={onClose}>
              OK
            </Button>
          </div>
        }
      />
    </LayoutModal>
  );
};

export default ValidationErrorModal;
