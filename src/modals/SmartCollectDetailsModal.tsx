import React, { useState } from "react";
import LayoutModal from "../components/common/modal/LayoutModal";
import WrapModal from "../components/common/modal/WrapModal";
import Button from "../components/common/base/Button";
import CheckboxField from "../components/common/modules/CheckboxField";
import Icon from "../components/common/base/Icon";

interface SmartCollectDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onInvoice: () => void;
  amount: string;
  amountCurrency: string;
  contactAddress: string;
  paymentWorkflow: string;
  receivingAccount: string;
  /** Charge mode: shows Customer Account + Receiving/Merchant Account, Charge button */
  isCharge?: boolean;
  /** For Charge: the selected customer source account (e.g. "Main Account Details ....6789") */
  customerAccount?: string;
  /** For Charge: true when from demo only (not Add Customer Account) → show "Merchant Services Account", else "Receiving Account" */
  isFromDemoOnly?: boolean;
}

const formatAccountDisplay = (text: string) => {
  const match = text.match(/^(.+?)\s+\*{4}(\d+)$/);
  if (match) {
    return (
      <>
        <div>{match[1]}</div>
        <div>••••{match[2]}</div>
      </>
    );
  }
  return <div>{text}</div>;
};

const SmartCollectDetailsModal: React.FC<SmartCollectDetailsModalProps> = ({
  open,
  onClose,
  onInvoice,
  amount,
  amountCurrency,
  contactAddress,
  paymentWorkflow,
  receivingAccount,
  isCharge = false,
  customerAccount = "",
  isFromDemoOnly = false,
}) => {
  const [makeDefault, setMakeDefault] = useState(false);

  if (!open) return null;

  return (
    <LayoutModal>
      <WrapModal
        className="w-125"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={onInvoice}>
              {isCharge ? "Charge" : "Invoice"}
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <div className="grid gap-2 w-full">
            <div className="text-center text-2xl mb-4 flex items-center justify-center space-x-1">
              <div className="font-bold text-gray-900">{amount}</div>
              <div className="text-gray-500">{amountCurrency}</div>
            </div>

            {isCharge ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4 mb-2">
                <div className="grid grid-cols-2 gap-6 text-sm leading-5">
                  <span className="font-medium text-gray-900">Customer Account</span>
                  <div className="text-gray-500">
                    {formatAccountDisplay(customerAccount || "Account ....6789")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 divide-y divide-gray-200">
                <div className="text-sm leading-5 font-semibold text-gray-900 px-4 py-2 bg-gray-100">
                  SMART Collect Details
                </div>
                <div className="space-y-2 text-sm leading-5 p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <span className="font-medium text-gray-900">Contact Address</span>
                    <span className="text-gray-700">{contactAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <span className="font-medium text-gray-900">Payment Workflow</span>
                    <span className="text-gray-700">
                      {paymentWorkflow.replace(/^STANDARD\s+/i, "")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 ring-2 ring-inset ring-gray-200">
                <Icon icon="arrow-down" className="text-gray-500" />
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 mb-6">
              <div className="grid grid-cols-2 gap-6 text-sm leading-5">
                <span className="font-medium text-gray-900">
                  {isCharge && isFromDemoOnly
                    ? "Merchant Services Account"
                    : "Receiving Account"}
                </span>
                <div className="text-gray-500">
                  {formatAccountDisplay(receivingAccount)}
                </div>
              </div>
            </div>

            <CheckboxField
              id="make-default"
              checked={makeDefault}
              onChange={(e) => setMakeDefault(e.target.checked)}
            >
              <span className="font-medium text-gray-700">
                Make default payment method
              </span>
              <span className="block mt-1 text-gray-500 font-normal">
                Checking this means next time you make a payment request it
                will be pre-selected. You can change it anytime in{" "}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  customer profile
                </a>
                .
              </span>
            </CheckboxField>
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default SmartCollectDetailsModal;
