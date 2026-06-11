import { useEffect, useState } from 'react';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';

type ReverifyCardProcessingModalProps = {
  open: boolean;
  onClose: () => void;
  /** Called when the user requests a new validation (before the success step is shown). */
  onRequestNewValidation: () => void;
};

const ReverifyCardProcessingModal = ({
  open,
  onClose,
  onRequestNewValidation,
}: ReverifyCardProcessingModalProps) => {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  useEffect(() => {
    if (open) setStep('confirm');
  }, [open]);

  const handleRequestNewValidation = () => {
    onRequestNewValidation();
    setStep('success');
  };

  return (
    <LayoutModal open={open}>
      {step === 'confirm' ? (
        <Modal
          className="w-128"
          title="Reverify Automatic Card Processing"
          titleCenter
          description="Have a new bank account or card payment processor, need to reverify touchless set-up? Request new verification and confirm the micro deposit to verify your bank account."
          icon={
            <Icon
              icon="information-circle"
              variant="solid"
              className="h-11 w-11 text-blue-500 -my-2"
            />
          }
          onClose={onClose}
          footer={
            <div className="w-full grid grid-cols-2 items-center gap-6">
              <Button variant="secondary" size="xl" onClick={onClose}>
                Cancel
              </Button>
              <Button size="xl" onClick={handleRequestNewValidation}>
                Request New Validation
              </Button>
            </div>
          }
        />
      ) : (
        <Modal
          className="w-128"
          title="Deposit initiated"
          titleCenter
          description="A micro deposit has been initiated and should be deposited to your bank account within 2-3 business days. Confirm the amount to complete reverification of automatic card payments."
          icon={
            <Icon
              icon="check-circle"
              variant="solid"
              className="h-11 w-11 text-green-500 -my-2"
            />
          }
          onClose={onClose}
          footer={
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={onClose}
            >
              Close
            </Button>
          }
        />
      )}
    </LayoutModal>
  );
};

export default ReverifyCardProcessingModal;
