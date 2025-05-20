import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";

interface ChooseDataModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChooseDataModal: React.FC<ChooseDataModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <Modal
        className="w-128"
        title="aaa"
        onClose={onClose}
        footer={
          <div className="flex items-center justify-end gap-6">
            <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
            <Button size="lg" onClick={onConfirm}>Select</Button>
          </div>
        }
      >

      </Modal>
    </LayoutModal>
  );
};

export default ChooseDataModal;