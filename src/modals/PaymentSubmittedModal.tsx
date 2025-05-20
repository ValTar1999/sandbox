import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";
import PaymentStepProgress from "../component/base/PaymentStepProgress";

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