import Button from '../../../../components/common/base/Button';
import Icon from '../../../../components/common/base/Icon';
import LayoutModal from '../../../../components/common/modal/LayoutModal';
import Modal from '../../../../components/common/modal/Modal';

export const MarkPaymentAsPaidModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <LayoutModal open={open}>
    <Modal
      className="w-128"
      title="Mark Payment as Paid"
      description="You are about to change the status of this payment to Paid. Are you sure you want to continue?"
      titleCenter
      icon={
        <Icon
          icon="information-circle"
          variant="solid"
          className="h-11 w-11 text-blue-500"
        />
      }
      onClose={onClose}
      footer={
        <div className="grid grid-cols-2 gap-4">
          <Button variant="secondary" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button size="lg" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      }
    />
  </LayoutModal>
);

export const MarkPaymentPaidSuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <LayoutModal open={open}>
    <Modal
      className="w-128"
      title="Status successfully changed!"
      titleCenter
      icon={
        <Icon
          icon="check-circle"
          variant="solid"
          className="h-11 w-11 text-green-500"
        />
      }
      onClose={onClose}
    >
      <Button size="lg" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Modal>
  </LayoutModal>
);
