import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';

interface RemoveCustomPaymentPreferenceModalProps {
  open: boolean;
  payerName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveCustomPaymentPreferenceModal = ({
  open,
  payerName,
  onClose,
  onConfirm,
}: RemoveCustomPaymentPreferenceModalProps) => (
  <LayoutModal open={open}>
    <Modal
      className="w-128"
      title="Remove Custom Payment Preference"
      titleCenter
      description={`Removing this custom payment preference will revert <b classNames="text-gray-900">${payerName}</b> to your Global Preference settings.`}
      icon={<Icon icon="exclamation" className="h-11 w-11 text-yellow-500" />}
      onClose={onClose}
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <Button variant="secondary" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="yellow" size="lg" onClick={onConfirm}>
          Yes, Remove
        </Button>
      </div>
    </Modal>
  </LayoutModal>
);

export default RemoveCustomPaymentPreferenceModal;
