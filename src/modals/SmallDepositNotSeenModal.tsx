import { useEffect, useState } from 'react';
import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import WrapModal from '../components/common/modal/WrapModal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';

type SmallDepositNotSeenModalProps = {
  open: boolean;
  onClose: () => void;
};

const SmallDepositNotSeenModal = ({
  open,
  onClose,
}: SmallDepositNotSeenModalProps) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      setStep('form');
      setMessage('');
    }
  }, [open]);

  return (
    <LayoutModal open={open}>
      {step === 'form' ? (
        <Modal
          className="w-128"
          title="I Don't See a Small Deposit"
          description="It may take up to 3 business days for the deposit to show up, and make sure you check any accounts used to settle funds from cards. If it's still not showing up, we may need more information. Please provide your Merchant Processing ID, which you can get from your current card processor; we'll use that and send another micro deposit."
          onClose={onClose}
          footer={
            <div className="flex w-full justify-end gap-4">
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button size="md" onClick={() => setStep('success')}>
                Send
              </Button>
            </div>
          }
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 p-3 text-sm leading-5 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Merchant Processing ID"
          />
        </Modal>
      ) : (
        <WrapModal className="modal-container w-128" onClose={onClose}>
          <div className="flex flex-col items-center gap-6 px-6 pb-6">
            <Icon
              icon="check-circle"
              variant="solid"
              className="h-11 w-11 text-green-500"
            />
            <div className="text-lg font-semibold text-gray-900 text-center">
              Your request was submitted
            </div>
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </WrapModal>
      )}
    </LayoutModal>
  );
};

export default SmallDepositNotSeenModal;
