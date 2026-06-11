import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';

type OptOutCardProcessingModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const OptOutCardProcessingModal = ({
  open,
  onClose,
  onConfirm,
}: OptOutCardProcessingModalProps) => (
  <LayoutModal open={open}>
    <Modal
      className="w-128"
      title="You are electing to opt out of automated card processing. Please confirm below."
      titleCenter
      description="By opting out, card payments <b>will not be automatically processed</b> and you will need to manually key in the card info."
      icon={
        <Icon
          icon="exclamation"
          variant="solid"
          className="h-11 w-11 text-red-500 -my-2"
        />
      }
      onClose={onClose}
      footer={
        <div className="w-full grid grid-cols-2 items-center gap-6">
          <Button variant="secondary" size="xl" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primaryDistructive" size="xl" onClick={onConfirm}>
            Yes, opt out
          </Button>
        </div>
      }
    />
  </LayoutModal>
);

export default OptOutCardProcessingModal;
