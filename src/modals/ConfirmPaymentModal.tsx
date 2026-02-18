import React, { useState, useMemo } from "react";
import clsx from "clsx";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import Icon from "../component/base/Icon";
import Badge from "../component/base/Badge";
import InfoBox from "../component/base/InfoBox";

export interface ConfirmPaymentVendor {
  name: string;
  paymentMethod: string;
  amountFormatted: string;
  payables: { id: string; dueDate: string; amount: string }[];
}

interface ConfirmPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmountFormatted: string;
  amountValute: string;
  originationAccountLabel: string;
  originationAccountMasked: string;
  vendors: ConfirmPaymentVendor[];
  isBulkPayment?: boolean;
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  totalAmountFormatted,
  amountValute,
  originationAccountLabel,
  originationAccountMasked,
  vendors,
  isBulkPayment = false,
}) => {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const toggleVendor = (name: string) => {
    setExpandedVendor((prev) => (prev === name ? null : name));
  };

  /** Показує тільки Method of Payment (наприклад ACH, SMART Disburse), без банку/рахунку */
  const paymentMethodLabel = (method: string) => {
    const sep = method.includes(" • ") ? " • " : method.includes(" · ") ? " · " : null;
    return sep ? method.split(sep)[0].trim() : method;
  };

  const showBulkPaymentInfo = useMemo(() => {
    return isBulkPayment || vendors.length > 1;
  }, [isBulkPayment, vendors.length]);

  if (!open) return null;

  return (
    <LayoutModal>
      <WrapModal
        className="w-125"
        header={
          <div className="flex items-center gap-3">
            <Icon icon="lightning-bolt" variant="outline" className="w-6 h-6 text-blue-600" />
            <div className="text-xl font-semibold text-gray-900">Pay Now</div>
          </div>
        }
        onClose={onClose}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={onConfirm}>
              Pay Now
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <div className="grid gap-2 w-full">
            <div className="text-center text-2xl mb-4 flex items-center justify-center space-x-1">
              <div className="font-bold text-gray-900">
                {totalAmountFormatted} 
              </div>
              <div className="text-gray-500">
                {amountValute}
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 grid grid-cols-2 gap-6 text-sm leading-5">
              <div className="font-medium text-gray-900">
                Origination Account
              </div>
              <div className="text-gray-700">
                {originationAccountLabel} {originationAccountMasked}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 ring-2 ring-inset ring-gray-200">
                <Icon icon="arrow-down" className="text-gray-500" />
              </div>
            </div>

            {showBulkPaymentInfo && (
              <InfoBox
                color="blue"
                icon="information-circle"
                title="You're about to make a Bulk Payment"
                text="This means you'll consolidate multiple payments into one transaction, using a single receiving bank account for all payables."
              />
            )}

            <div className="flex flex-col gap-2">
            {vendors.map((vendor) => {
              const isExpanded = expandedVendor === vendor.name;
              const hasPayables = vendor.payables.length > 0;
              return (
                <div
                  key={vendor.name}
                  className="rounded-md bg-gray-50 overflow-hidden"
                >
                  <div
                    className={clsx(
                      "flex items-center gap-3 p-2",
                      hasPayables && "cursor-pointer hover:bg-gray-100/80"
                    )}
                    onClick={() => hasPayables && toggleVendor(vendor.name)}
                  >
                    <Icon
                      icon="chevron-right"
                      className={clsx(
                        "w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ease-out",
                        isExpanded ? "rotate-90" : ""
                      )}
                    />
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {vendor.name}
                          </div>
                        </div>
                        <Badge color="gray" size="sm">
                          {paymentMethodLabel(vendor.paymentMethod)}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap flex items-center gap-1">
                        {vendor.amountFormatted} <span className="text-gray-500">USD</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                    style={{
                      gridTemplateRows:
                        isExpanded && hasPayables ? "1fr" : "0fr",
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {hasPayables && (
                        <div className="border-t border-gray-200 divide-y divide-gray-200 mx-2">
                          {vendor.payables.map((p) => (
                            <div
                              key={p.id}
                              className="grid grid-cols-3 gap-4 font-medium text-sm py-2"
                            >
                              <span className="text-gray-500 uppercase ml-8">
                                {p.id}
                              </span>
                              <span className="text-gray-500">
                                Due: <span className="text-gray-900">{p.dueDate}</span>
                              </span>
                              <span className="text-gray-900 whitespace-nowrap text-right">
                                ${p.amount} <span className="text-gray-500">USD</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default ConfirmPaymentModal;
