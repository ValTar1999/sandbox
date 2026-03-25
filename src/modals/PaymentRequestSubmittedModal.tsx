import React from "react";
import LayoutModal from "../components/common/modal/LayoutModal";
import Modal from "../components/common/modal/Modal";
import Button from "../components/common/base/Button";
import Icon from "../components/common/base/Icon";
import PaymentStepProgress from "../components/common/base/PaymentStepProgress";

interface PaymentRequestSubmittedModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const PaymentRequestSubmittedModal: React.FC<
  PaymentRequestSubmittedModalProps
> = ({ open, onClose, onDone }) => {
  if (!open) return null;

  return (
    <LayoutModal>
      <Modal
        className="w-150"
        title="Payment Request Submitted!"
        description="Your payment request is in progress. Check back later for status updates. If there are additional actions for you to take, you'll be notified."
        icon={
          <Icon icon="check-circle" className="h-11 w-11 text-green-500" />
        }
        onClose={onClose}
        titleCenter
      >
        <div className="w-full space-y-6">
          <PaymentStepProgress
            data={[
              { text: "Request Initiation", state: "done" },
              { text: "In Progress", state: "progress" },
              { text: "Paid" },
            ]}
          />
          <Button size="xl" className="w-full" onClick={onDone}>
            Done
          </Button>
        </div>
      </Modal>
    </LayoutModal>
  );
};

export default PaymentRequestSubmittedModal;
