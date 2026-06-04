import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';

type RemoveProfilePhotoModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const RemoveProfilePhotoModal = ({
  open,
  onClose,
  onConfirm,
}: RemoveProfilePhotoModalProps) => {
  return (
    <LayoutModal open={open}>
      <Modal
        className="w-128"
        title="Remove Profile Photo"
        description="Are you sure you want to remove profile photo?"
        titleCenter
        icon={<Icon icon="exclamation" className="h-11 w-11 text-red-500" />}
        onClose={onClose}
        footer={
          <div className="w-full grid grid-cols-2 items-center gap-6">
            <Button variant="secondary" size="xl" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primaryDistructive" size="xl" onClick={onConfirm}>
              Remove
            </Button>
          </div>
        }
      ></Modal>
    </LayoutModal>
  );
};

export default RemoveProfilePhotoModal;
