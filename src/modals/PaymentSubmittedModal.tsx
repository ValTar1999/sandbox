import React from 'react';
import LayoutModal from "../components/common/modal/LayoutModal";
import Modal from "../components/common/modal/Modal";
import Button from "../components/common/base/Button";
import Icon from "../components/common/base/Icon";
import PaymentStepProgress from "../components/common/base/PaymentStepProgress";

interface PaymentSubmittedModalProps {
  open: boolean;
  onClose: () => void;
  handlePaymentSubmittedClick: () => void;
}

const PaymentSubmittedModal: React.FC<PaymentSubmittedModalProps> = ({ open, onClose, handlePaymentSubmittedClick }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <Modal
        className="w-150"
        title="Payment Submitted!"
        description="Your payment is in progress. Check back later for status updates. If there are additional actions for you to take, you'll be notified."
        icon={<Icon icon="check-circle" className="h-11 w-11 text-green-500" />}
        onClose={onClose}
      >
        <PaymentStepProgress/>
        <Button 
          size="xl"
          className="w-full" 
          onClick={handlePaymentSubmittedClick}
        >
          Done
        </Button>
      </Modal>
    </LayoutModal>
  );
};

export default PaymentSubmittedModal;