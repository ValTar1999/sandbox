import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import Calendar from "../component/modules/Calendar";

interface ChooseDataModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ChooseDataModal: React.FC<ChooseDataModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <WrapModal
        className="w-128"
        title="aaa"
        onClose={onClose}
        header={
          <div className="">Schedule for Later</div>
        }
        footer={
          <div className="flex items-center justify-end gap-6">
            <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
            <Button size="lg" onClick={onConfirm}>Select</Button>
          </div>
        }
      >
        <Calendar/>
        <div className="grid gap-6 px-6 py-4">
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
            <div className="grid gap-1 text-xs">
              <div className="font-semibold text-gray-900">Schedule Timing</div>
              <div className="text-xs text-gray-500">Please note that all scheduled payments will be submitted on selected date starting from 9 AM (ET).</div>
            </div>
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default ChooseDataModal;