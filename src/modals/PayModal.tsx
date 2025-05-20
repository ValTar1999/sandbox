import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";
import CheckboxField from "../component/modules/CheckboxField";
import { payments } from "../pages/BillsPayables/data";

interface PayModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PayModal: React.FC<PayModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <LayoutModal>
      <Modal
        className="w-125"
        footer={
          <div className="flex items-center justify-end gap-6">
            <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
            <Button size="lg" onClick={onConfirm}>Pay Now</Button>
          </div>
        }
      >
        <div className="grid gap-6">
          <div className="flex items-center justify-center gap-1 text-2xl">
            <div className="font-bold">{payments[0]?.totalAmount}</div>
            <div className="text-gray-500">{payments[0]?.amountValute}</div>
          </div>
          <div>
            <div className="flex rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <div className="grid grid-cols-2 items-start text-start gap-6">
                <div className="font-medium">Origination Account</div>
                <div className="text-gray-700">Secondary Bank Account ••••1010</div>
              </div>
            </div>
            <div className="my-1.5 flex items-center justify-center">
              <div className="flex h-10 w-10 flex-shrink-0 rounded-full bg-gray-50 ring-2 ring-inset ring-gray-200">
                <Icon
                  icon="arrow-down"
                  className="m-auto text-gray-500"
                />
              </div>
            </div>
          </div>
          <CheckboxField
            title="Make default payment method"
            subtitle="Checking this means next time you make a payment it will be pre-selected. You can change it anytime in <a href='#' class='text-blue-600 font-medium'>vendor profile</a>."
          />
        </div>
      </Modal>
    </LayoutModal>
  );
};

export default PayModal;