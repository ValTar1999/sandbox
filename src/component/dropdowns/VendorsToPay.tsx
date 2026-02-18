import React, { useState, useMemo, useCallback } from "react";
import clsx from "clsx";
import CheckBox from "../base/CheckBox";
import Icon from "../base/Icon";
import Button from "../base/Button";
import Badge from "../base/Badge";
import Toggle from "../base/Toggle";
import Tooltip, { TooltipTrigger, TooltipContent } from "../base/Tooltip";
import UnsupportedBulkPaymentMethodModal from "../../modals/UnsupportedBulkPaymentMethodModal";
import { payments, Payment, PayableItem } from "../../pages/BillsPayables/data";

const SUPPORTED_BULK_PAYMENT_METHODS = ["ach", "rtp", "smart exchange", "wire"] as const;

const calculateTotalAmount = (payables: PayableItem[]): number => {
  return payables.reduce((acc, payable) => {
    // Удаляем все символы $, запятые и пробелы, затем парсим
    const cleanAmount = payable.amount.replace(/[$,\s]/g, "");
    const parsed = parseFloat(cleanAmount);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);
};

type SmartDisburseContact = {
  id: string;
  type: "email" | "phone";
  value: string;
  label?: string;
};

interface VendorsToPayProps {
  payment?: Payment | null;
  /** Selected payment method label per vendor name (overrides payment.vendors[].paymentMethod when set) */
  vendorPaymentMethods?: Record<string, string>;
  /** Selected email per vendor name (for backward compatibility) */
  vendorPaymentEmails?: Record<string, string>;
  /** Selected contacts per vendor name (for SMART Disburse) */
  vendorPaymentContacts?: Record<string, SmartDisburseContact[]>;
  /** Selected bank account per vendor name */
  vendorBankAccounts?: Record<string, { value: string; label: string }>;
  /** Bulk payment enabled per vendor name */
  vendorBulkPayment?: Record<string, boolean>;
  onSelectPaymentMethodClick?: (vendorName: string, isBulkPayment?: boolean) => void;
  onBulkPaymentChange?: (vendorName: string, enabled: boolean) => void;
  onDiscardPaymentMethod?: (vendorName: string) => void;
}

const VendorsToPay: React.FC<VendorsToPayProps> = ({
  payment: paymentProp,
  vendorPaymentMethods: vendorPaymentMethodsProp,
  vendorPaymentEmails: vendorPaymentEmailsProp,
  vendorPaymentContacts: vendorPaymentContactsProp,
  vendorBankAccounts: vendorBankAccountsProp,
  vendorBulkPayment: vendorBulkPaymentProp,
  onSelectPaymentMethodClick,
  onBulkPaymentChange,
  onDiscardPaymentMethod,
}) => {
  const [openVendors, setOpenVendors] = useState<string[]>([]);
  const [bulkPaymentByVendor, setBulkPaymentByVendor] = useState<Record<string, boolean>>({});
  const [unsupportedBulkPaymentModal, setUnsupportedBulkPaymentModal] = useState<{
    open: boolean;
    vendorName: string | null;
    isUnsupportedMethod?: boolean;
  }>({ open: false, vendorName: null, isUnsupportedMethod: false });

  const toggleVendor = useCallback((vendorName: string) => {
    setOpenVendors((prev) =>
      prev.includes(vendorName)
        ? prev.filter((name) => name !== vendorName)
        : [...prev, vendorName]
    );
  }, []);

  const vendors = useMemo(() => {
    const paymentWithVendors = paymentProp ?? payments.find((p) => p.vendors);
    return paymentWithVendors?.vendors || [];
  }, [paymentProp]);

  const { totalVendors, totalVendorsPayables, totalAmount } = useMemo(() => {
    const totalVendors = vendors.length;
    const totalVendorsPayables = vendors.reduce(
      (acc, vendor) => acc + vendor.payables.length,
      0
    );
    const totalAmount = vendors
      .reduce((acc, vendor) => acc + calculateTotalAmount(vendor.payables), 0)
      .toFixed(2);
    return { totalVendors, totalVendorsPayables, totalAmount };
  }, [vendors]);

  const normalizeBankAccount = useCallback((str: string) => 
    str.replace(/\s+/g, ' ').trim(), []);

  const isPaymentMethodSupported = useCallback((method: string): boolean => {
    const lowerMethod = method.toLowerCase();
    return SUPPORTED_BULK_PAYMENT_METHODS.some(m => 
      lowerMethod.includes(m.toLowerCase()) || 
      m.toLowerCase().includes(lowerMethod)
    );
  }, []);

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

                  <CheckBox 
                    checked 
                    onChange={() => {}} 
                    onClick={(e) => e.stopPropagation()} 
                  />
                </div>

                <div className="grid w-full grid-cols-[196px_auto_auto_1fr] items-center">
                  <div className="flex flex-col gap-1 text-sm">
                    <h3 className="font-medium text-gray-900 truncate">{vendor.name}</h3>
                    <div className="text-gray-500">{vendor.payables.length} payables</div>
                  </div>

                  <div className="flex items-center">
                    <hr className="border-0 w-px h-11 bg-gray-200 mx-6" />
                    <div className="flex items-center gap-2 px-4">
                      <Toggle
                        checked={vendorBulkPaymentProp?.[vendor.name] ?? bulkPaymentByVendor[vendor.name] ?? false}
                        onChange={(checked) => {
                          const currentMethod = (
                            vendorPaymentMethodsProp?.[vendor.name] ??
                            vendor.paymentMethod ??
                            ""
                          ).trim();
                          
                          const isSupported = isPaymentMethodSupported(currentMethod);
                          const isSmartDisburse = currentMethod.toLowerCase().includes("smart disburse");
                          const currentToggleState = vendorBulkPaymentProp?.[vendor.name] ?? bulkPaymentByVendor[vendor.name] ?? false;
                          
                          if (checked) {
                            // При включении toggle проверяем поддержку метода
                            if (currentMethod !== "" && !isSupported) {
                              setUnsupportedBulkPaymentModal({ 
                                open: true, 
                                vendorName: vendor.name,
                                isUnsupportedMethod: true
                              });
                              return;
                            }
                          } else {
                            // При выключении toggle проверяем, нужно ли показывать модалку подтверждения
                            if (currentToggleState && currentMethod !== "" && !isSmartDisburse) {
                              setUnsupportedBulkPaymentModal({ 
                                open: true, 
                                vendorName: vendor.name,
                                isUnsupportedMethod: false
                              });
                              return;
                            }
                          }
                          
                          setBulkPaymentByVendor((prev) => ({
                            ...prev,
                            [vendor.name]: checked,
                          }));
                          onBulkPaymentChange?.(vendor.name, checked);
                        }}
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">Bulk Payment</span>
                      <Tooltip placement="top">
                        <TooltipTrigger as="span" className="inline-flex" onClick={(e) => e.stopPropagation()}>
                          <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white px-2.5 py-1 text-xs rounded-md">
                          Pay all selected payables in one transaction
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <hr className="border-0 w-px h-11 bg-gray-200 mx-6" />
                  </div>


                  <div>
                    <div className="text-xs font-medium uppercase text-gray-500 mb-1">
                      PAYMENT METHOD
                    </div>
                    {hasPaymentMethod ? (
                      <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-100 py-0.5 px-2.5">
                        <div className="text-sm font-medium text-gray-900">
                          {selectedMethod}
                          {(() => {
                            const contacts = vendorPaymentContactsProp?.[vendor.name];
                            const email = vendorPaymentEmailsProp?.[vendor.name];
                            
                            if (contacts && contacts.length > 0) {
                              return contacts.map((contact, index) => (
                                <span key={contact.id} className="text-gray-900">
                                  {index === 0 ? " • " : ", "}
                                  {contact.value}
                                </span>
                              ));
                            }
                            if (email) {
                              return <span className="text-gray-900"> • {email}</span>;
                            }
                            return null;
                          })()}
                        </div>
                        <Button
                          variant="linkSecondary"
                          icon="pencil"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPaymentMethodClick?.(
                              vendor.name,
                              vendorBulkPaymentProp?.[vendor.name] ?? false
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectPaymentMethodClick?.(
                          vendor.name,
                          vendorBulkPaymentProp?.[vendor.name] ?? false
                        )}
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
                  {vendor.payables.map((payable) => {
                    const originalBankAccount = (payable.bankAccounts || '').trim();
                    const selectedBankAccount = (vendorBankAccountsProp?.[vendor.name]?.label || '').trim();
                    
                    const normalizedOriginal = normalizeBankAccount(originalBankAccount);
                    const normalizedSelected = normalizeBankAccount(selectedBankAccount);
                    
                    const bankAccountChanged = 
                      normalizedSelected !== '' && 
                      normalizedOriginal !== '' && 
                      normalizedSelected !== normalizedOriginal;
                    
                    const displayBankAccount = bankAccountChanged 
                      ? selectedBankAccount 
                      : (originalBankAccount || selectedBankAccount);
                    
                    return (
                    <div key={payable.id} className="flex items-center border-b border-gray-200">
                      <div className="pl-5 pr-2">
                        <CheckBox checked onChange={() => {}} />
                      </div>
                      <div className="grid w-full grid-cols-[423px_auto_auto_1fr] p-4 gap-4 items-center">
                        <div className="flex flex-col">
                          <div className="uppercase font-medium text-gray-900">{payable.id}</div>
                          <div className="flex items-center gap-2">
                            {bankAccountChanged ? (
                              <>
                                <div className="text-sm text-gray-500 line-through text-nowrap">{originalBankAccount}</div>
                                <div className="text-sm text-gray-900 text-nowrap">{selectedBankAccount}</div>
                                <Badge size="xs" icon="exclamation" iconDirection="left" color="yellow" rounded>Changed account</Badge>
                              </>
                            ) : displayBankAccount ? (
                              <div className="text-sm text-gray-500">{displayBankAccount}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                          <div className="text-xs uppercase text-gray-500 mt-0.5">Due:</div>
                          <div className="text-sm text-gray-900">{payable.dueDate}</div>
                        </div>
                        <div />
                        <div className="text-right text-sm font-medium text-gray-900">
                          ${payable.amount} <span className="font-normal text-gray-500">USD</span>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <UnsupportedBulkPaymentMethodModal
        open={unsupportedBulkPaymentModal.open}
        isUnsupportedMethod={unsupportedBulkPaymentModal.isUnsupportedMethod}
        onClose={() => setUnsupportedBulkPaymentModal({ open: false, vendorName: null, isUnsupportedMethod: false })}
        onChangePaymentMethod={() => {
          if (unsupportedBulkPaymentModal.vendorName) {
            onSelectPaymentMethodClick?.(unsupportedBulkPaymentModal.vendorName);
          }
        }}
        onDiscard={() => {
          if (unsupportedBulkPaymentModal.vendorName) {
            onDiscardPaymentMethod?.(unsupportedBulkPaymentModal.vendorName);
          }
        }}
      />
    </div>
  );
};

export default VendorsToPay;
