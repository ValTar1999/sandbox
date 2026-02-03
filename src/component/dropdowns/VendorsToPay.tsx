import React, { useState } from "react";
import clsx from "clsx";
import CheckBox from "../base/CheckBox";
import Icon from "../base/Icon";
import Button from "../base/Button";
import { payments, Payment, PayableItem, Vendor } from "../../pages/BillsPayables/data";

const calculateTotalAmount = (payables: PayableItem[]): number => {
  return payables.reduce((acc, payable) => {
    const cleanAmount = payable.amount.replace(/,/g, "");
    return acc + parseFloat(cleanAmount);
  }, 0);
};

interface VendorsToPayProps {
  payment?: Payment | null;
  /** Selected payment method label per vendor name (overrides payment.vendors[].paymentMethod when set) */
  vendorPaymentMethods?: Record<string, string>;
  onSelectPaymentMethodClick?: (vendorName: string) => void;
}

const VendorsToPay: React.FC<VendorsToPayProps> = ({
  payment: paymentProp,
  vendorPaymentMethods: vendorPaymentMethodsProp,
  onSelectPaymentMethodClick,
}) => {
  const [openVendors, setOpenVendors] = useState<string[]>([]);

  const toggleVendor = (vendorName: string) => {
    setOpenVendors((prev) =>
      prev.includes(vendorName)
        ? prev.filter((name) => name !== vendorName)
        : [...prev, vendorName]
    );
  };

  const paymentWithVendors = paymentProp ?? payments.find((p) => p.vendors);
  const vendors: Vendor[] = paymentWithVendors?.vendors || [];

  const totalVendors = vendors.length;
  const totalVendorsPayables = vendors.reduce(
    (acc, vendor) => acc + vendor.payables.length,
    0
  );

  const totalAmount = vendors
    .reduce((acc, vendor) => acc + calculateTotalAmount(vendor.payables), 0)
    .toFixed(2);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg font-medium text-gray-900">Vendors to Pay</div>
          <div className="text-sm text-gray-500">
            {totalVendors} vendors with a total of {totalVendorsPayables} payables.
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 mr-4">
          <div className="text-xs text-gray-500">Total amount</div>
          <div className="text-sm font-medium text-gray-900">
            ${totalAmount} <span className="text-gray-500">USD</span>
          </div>
        </div>
      </div>

      <div>
        {vendors.map((vendor) => {
          const vendorTotalAmount = calculateTotalAmount(vendor.payables).toFixed(2);
          const selectedMethod = (
            vendorPaymentMethodsProp?.[vendor.name] ??
            vendor.paymentMethod ??
            ""
          ).trim();
          const hasPaymentMethod = selectedMethod !== "";

          return (
            <div key={vendor.name}>
              <div
                className={clsx(
                  "flex items-center gap-5 border-b border-gray-200 p-4",
                  hasPaymentMethod ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => {
                  if (hasPaymentMethod) toggleVendor(vendor.name);
                }}
              >
                <div className="flex items-center gap-5">
                  <Icon
                    icon="chevron-right"
                    className={clsx(
                      "w-5 h-5 text-gray-400 transition-transform duration-300",
                      hasPaymentMethod && openVendors.includes(vendor.name) ? "rotate-90" : "rotate-0"
                    )}
                  />

                  <CheckBox checked onClick={(e) => e.stopPropagation()} />
                </div>

                <div className="grid w-full grid-cols-3 items-center">
                  <div className="flex flex-col gap-1 text-sm">
                    <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                    <div className="text-gray-500">{vendor.payables.length} payables</div>
                  </div>

                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 mb-1">
                      PAYMENT METHOD
                    </div>
                    {hasPaymentMethod ? (
                      <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-0.5 px-2.5">
                        <div className="text-sm font-medium text-gray-900">{selectedMethod}</div>
                        <Button
                          variant="linkSecondary"
                          icon="pencil"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPaymentMethodClick?.(vendor.name);
                          }}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectPaymentMethodClick?.(vendor.name)}
                        className="inline-flex py-1.5 text-sm font-semibold cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-300"
                      >
                        Select Payment Method
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="text-sm font-medium text-gray-900">
                      ${vendorTotalAmount} <span className="text-gray-500">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {hasPaymentMethod && vendor.payables.length > 0 && (
                <div
                  className={clsx(
                    "transition-all duration-500 pl-20 space-y-2",
                    openVendors.includes(vendor.name)
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  )}
                >
                  {vendor.payables.map((payable) => (
                    <div key={payable.id} className="flex items-center border-b border-gray-200">
                      <div className="pl-5 pr-2">
                        <CheckBox checked />
                      </div>
                      <div className="grid w-full grid-cols-3 p-4">
                        <div className="uppercase">{payable.id}</div>
                        <div className="flex items-center gap-1 font-medium">
                          <div className="text-xs uppercase text-gray-500">Due:</div>
                          <div className="text-sm text-gray-900">{payable.dueDate}</div>
                        </div>
                        <div className="text-right text-sm font-medium text-gray-900">
                          ${payable.amount} <span className="font-normal text-gray-500">USD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorsToPay;
