import React from "react";
import Icon from "../components/common/base/Icon";
import Button from "../components/common/base/Button";
import LayoutModal from "../components/common/modal/LayoutModal";
import Modal from "../components/common/modal/Modal";
import PaymentStepProgress from "../components/common/base/PaymentStepProgress";

interface ReRunPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ReRunPaymentModal: React.FC<ReRunPaymentModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <Modal
        className="w-150"
        title="Payment Re-submitted!"
        description="Your payment is in progress. Check back later for status updates. If there are additional actions for you to take, you'll be notified."
        icon={<Icon icon="check-circle" className="h-11 w-11 text-green-500" />}
        onClose={onClose}
      >
        <PaymentStepProgress/>
        <Button size="xl"className="w-full" onClick={onConfirm}>Done</Button>
      </Modal>
    </LayoutModal>
  );
};

export default ReRunPaymentModal;
