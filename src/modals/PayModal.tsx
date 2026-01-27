import React from 'react';
import LayoutModal from "../component/modal/LayoutModal";
import Modal from "../component/modal/Modal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";
import CheckboxField from "../component/modules/CheckboxField";
import { payments } from "../pages/BillsPayables/data";
import AccountDetails from '../component/modules/AccountDetails';
import InfoBox from '../component/base/InfoBox';

interface PayModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethod?: string;
  sendingMethod?: string;
  contactEmail?: string;
  smartDisburseContacts?: {
    id: string;
    type: "email" | "phone";
    value: string;
    label?: string;
    subLabel?: string;
  }[];
}

const PayModal: React.FC<PayModalProps> = ({
  open,
  onClose,
  onConfirm,
  paymentMethod,
  sendingMethod,
  contactEmail,
  smartDisburseContacts,
}) => {
  if (!open) return null;
  const isCardMethod = paymentMethod === "card";
  const isSmartDisburse = paymentMethod === "smart-disburse";
  return (
    <LayoutModal>
      <Modal
        className="w-125"
        footer={
          <div className="flex items-center justify-end gap-6">
            <Button variant="secondary" size="lg" onClick={onClose}>Cancel</Button>
            <Button size="lg" onClick={isCardMethod ? onClose : onConfirm}>Pay Now</Button>
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

            <AccountDetails
              variant={isSmartDisburse ? "smart-disburse" : isCardMethod ? "card" : "bank"}
              smartDisburseContacts={smartDisburseContacts}
            />
            {!isCardMethod && !isSmartDisburse && (
              <InfoBox
                color="blue"
                icon="information-circle"
                title='If your Routing Number, Account Number or Address records (as registered under the bank account) are no longer accurate, please update the details in your ERP. Once your details are updated, please "Refresh" to reflect the changes.'
              />
            )}
            {isCardMethod && sendingMethod === "delivery" && !!contactEmail && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-gray-100 px-4 py-2">
                  <div className="text-sm font-semibold text-gray-900 leading-5">Contact Details</div>
                </div>
                <div className="px-4 py-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-y-2 text-sm leading-5">
                    <div className="text-gray-900 font-medium">Email</div>
                    <div className="text-gray-700">{contactEmail}</div>
                  </div>
                </div>
              </div>
            )}

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