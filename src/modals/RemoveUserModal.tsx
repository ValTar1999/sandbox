import LayoutModal from '../components/common/modal/LayoutModal';
import Modal from '../components/common/modal/Modal';
import Button from '../components/common/base/Button';
import Icon from '../components/common/base/Icon';
import type { UserRow } from '../pages/UserManagment/data';

type RemoveUserModalProps = {
  user: UserRow | null;
  onClose: () => void;
  onConfirm: () => void;
};

const RemoveUserModal = ({ user, onClose, onConfirm }: RemoveUserModalProps) => {
  if (!user) return null;

  return (
    <LayoutModal open={Boolean(user)}>
      <Modal
        className="w-128"
        title="Remove User from Business"
        titleCenter
        description={`Are you sure you want to Remove User <b>[${user.name === '-' ? user.email : user.name}]</b>?`}
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

export default RemoveUserModal;
