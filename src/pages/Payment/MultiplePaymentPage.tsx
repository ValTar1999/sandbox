import React, { useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/base/Button";
import ScheduleForBox from "../../components/common/base/ScheduleForBox";
import Badge from "../../components/common/base/Badge";
import Box from "../../components/layout/Box";
import { RefreshButton } from "../../components/common/base/RefreshButton";
import WrapSelect from "../../components/common/base/WrapSelect";
import DropdownCalendar from "../../components/common/dropdowns/DropdownCalendar";
import VendorsToPay from "../../components/common/dropdowns/VendorsToPay";
import SelectPaymentMethodModal from "../../modals/SelectPaymentMethodModal";
import ConfirmPaymentModal, {
  type ConfirmPaymentVendor,
} from "../../modals/ConfirmPaymentModal";
import PaymentSubmittedModal from "../../modals/PaymentSubmittedModal";
import { payments, Payment } from "../BillsPayables/data";


const bankAccounts = [
  {
    label: "Secondary Bank Account",
    value: "secondary",
    description: "Bank AG ••••1010",
    descriptionPosition: "below" as const,
    rightValue: "$111,921.02",
  },
  {
    label: "Main Bank Account",
    value: "main",
    description: "Bank AG ••••1010",
    descriptionPosition: "below" as const,
    rightValue: "$111,921.02",
  },
  {
    label: "Insurance Bank Account",
    value: "insurance",
    description: "Bank AG ••••1911",
    descriptionPosition: "below" as const,
    rightValue: "$56,921.02",
    inactive: true,
  },
];

const MultiplePaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSelectPaymentMethodModalOpen, setIsSelectPaymentMethodModalOpen] =
    useState(false);
  const [vendorSelectingPaymentMethod, setVendorSelectingPaymentMethod] =
    useState<string | null>(null);
  const [vendorPaymentMethods, setVendorPaymentMethods] = useState<
    Record<string, string>
  >({});
  const [vendorPaymentEmails, setVendorPaymentEmails] = useState<
    Record<string, string>
  >({});
  const [vendorPaymentContacts, setVendorPaymentContacts] = useState<
    Record<string, Array<{ id: string; type: "email" | "phone"; value: string; label?: string }>>
  >({});
  const [vendorBankAccounts, setVendorBankAccounts] = useState<
    Record<string, { value: string; label: string }>
  >({});
  const [vendorBulkPayment, setVendorBulkPayment] = useState<
    Record<string, boolean>
  >({});
  const [vendorBulkPaymentForModal, setVendorBulkPaymentForModal] = useState(false);
  const [originationAccountError, setOriginationAccountError] = useState(false);
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] =
    useState(false);
  const [isPaymentSubmittedModalOpen, setIsPaymentSubmittedModalOpen] =
    useState(false);

  const selectedIds = useMemo(
    () => (location.state as { selectedIds?: string[] })?.selectedIds ?? [],
    [location.state]
  );

  const selectedPayments = useMemo(
    () => payments.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  );

  const totalAmount = useMemo(() => {
    return selectedPayments.reduce((sum, p) => {
      const value = parseFloat(p.totalAmount.replace(/[$,]/g, ""));
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);
  }, [selectedPayments]);

  const totalFormatted = totalAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleBack = useCallback(() => navigate(-1), [navigate]);
  const handleClearSchedule = useCallback(() => {
    setSelectedDate(null);
    setSelectedIndex(null);
  }, []);
  const firstDueDate = selectedPayments[0]?.dueDate ?? "";

  const resetVendorData = useCallback((vendorName: string) => {
    setVendorPaymentMethods((prev) => {
      const updated = { ...prev };
      delete updated[vendorName];
      return updated;
    });
    setVendorPaymentEmails((prev) => {
      const updated = { ...prev };
      delete updated[vendorName];
      return updated;
    });
    setVendorPaymentContacts((prev) => {
      const updated = { ...prev };
      delete updated[vendorName];
      return updated;
    });
    setVendorBankAccounts((prev) => {
      const updated = { ...prev };
      delete updated[vendorName];
      return updated;
    });
    setVendorBulkPayment((prev) => {
      const updated = { ...prev };
      delete updated[vendorName];
      return updated;
    });
  }, []);

  const mapPaymentMethodToValue = useCallback((method: string): string => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes("ach")) return "ach";
    if (lowerMethod.includes("wire")) return "wire";
    if (lowerMethod.includes("smart disburse")) return "smart-disburse";
    return "";
  }, []);

  const paymentForVendors = useMemo((): Payment => {
    // Собираем все vendors из выбранных payments
    const vendorsMap = new Map<string, {
      name: string;
      paymentMethod: string;
      paymentMail?: string;
      paymentPhone?: string;
      payables: Array<{
        id: string;
        dueDate: string;
        amount: string;
        bankAccounts?: string;
      }>;
    }>();

    selectedPayments.forEach((p) => {
      if (p.vendors && p.vendors.length > 0) {
        // Если у payment есть vendors, используем их
        p.vendors.forEach((vendor) => {
          const existingVendor = vendorsMap.get(vendor.name);
          if (existingVendor) {
            // Объединяем payables если vendor уже существует
            existingVendor.payables.push(...vendor.payables);
          } else {
            // Добавляем новый vendor
            vendorsMap.set(vendor.name, {
              name: vendor.name,
              paymentMethod: vendor.paymentMethod || "",
              paymentMail: vendor.paymentMail,
              paymentPhone: vendor.paymentPhone,
              payables: [...vendor.payables],
            });
          }
        });
      } else {
        // Если у payment нет vendors, создаем vendor из payee
        const existingVendor = vendorsMap.get(p.payee);
        if (existingVendor) {
          existingVendor.payables.push({
            id: p.billReference,
            dueDate: p.dueDate,
            amount: p.totalAmount.replace(/[$,]/g, ""),
            bankAccounts: p.bankAccounts,
          });
        } else {
          vendorsMap.set(p.payee, {
            name: p.payee,
            paymentMethod: "",
            payables: [
              {
                id: p.billReference,
                dueDate: p.dueDate,
                amount: p.totalAmount.replace(/[$,]/g, ""),
                bankAccounts: p.bankAccounts,
              },
            ],
          });
        }
      }
    });

    const vendors = Array.from(vendorsMap.values());

    return {
      id: "multiple",
      totalAmount: `$${totalFormatted}`,
      amountValute: "USD",
      billReference: "",
      payee: "",
      source: "",
      dueDate: firstDueDate,
      status: "unprocessed",
      notes: "",
      attachments: "",
      vendors,
    };
  }, [selectedPayments, totalFormatted, firstDueDate]);

  const selectedBankAccount = useMemo(
    () => bankAccounts.find((a) => a.value === selectedAccount),
    [selectedAccount]
  );

  const allVendorsHavePaymentMethod = useMemo(() => {
    const vendors = paymentForVendors.vendors ?? [];
    if (vendors.length === 0) return true;
    return vendors.every((v) => {
      const method = (vendorPaymentMethods[v.name] ?? v.paymentMethod ?? "").trim();
      return method !== "";
    });
  }, [paymentForVendors.vendors, vendorPaymentMethods]);

  const handlePay = useCallback(() => {
    if (!selectedAccount) {
      setOriginationAccountError(true);
      return;
    }
    if (!allVendorsHavePaymentMethod) return;
    setOriginationAccountError(false);
    setIsConfirmPaymentModalOpen(true);
  }, [selectedAccount, allVendorsHavePaymentMethod]);

  const confirmModalVendors = useMemo((): ConfirmPaymentVendor[] => {
    const vendors = paymentForVendors.vendors ?? [];
    return vendors.map((v) => {
      const payables = v.payables ?? [];
      const sum = payables.reduce((acc, p) => {
        const amount = parseFloat(p.amount.replace(/,/g, ""));
        return acc + (Number.isNaN(amount) ? 0 : amount);
      }, 0);
      const amountFormatted = sum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const paymentMethod =
        vendorPaymentMethods[v.name] ?? v.paymentMethod ?? "";
      return {
        name: v.name,
        paymentMethod,
        amountFormatted,
        payables: payables.map((p) => ({
          id: p.id,
          dueDate: p.dueDate,
          amount: p.amount.replace(/,/g, ""),
        })),
      };
    });
  }, [paymentForVendors, vendorPaymentMethods]);

  return (
    <Box
      className="max-w-7xl mx-auto"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button variant="add_on" icon="arrow-left" onClick={handleBack} />
            <span className="text-lg font-medium text-gray-900 ml-4">
              Initiate a Payment
            </span>
          </div>
          <RefreshButton />
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 w-full justify-end">
            <Button size="md" onClick={handlePay}>
              Pay: ${totalFormatted}
            </Button>
            <DropdownCalendar
              dueDate={firstDueDate}
              onSelectDate={setSelectedDate}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              handleChooseDataClick={() => {}}
            />
          </div>
          <ScheduleForBox selectedDate={selectedDate} onClear={handleClearSchedule} />
        </div>
      }
    >
      <div className="p-6">
        {/* Payment summary */}
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">${totalFormatted}</span>{" "}
                <span className="text-gray-500">USD</span>
              </div>
              <Badge icon="flag" iconDirection="left">
                Unprocessed
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="md" onClick={handlePay}>
                Pay: ${totalFormatted}
              </Button>
              <DropdownCalendar
                dueDate={firstDueDate}
                onSelectDate={setSelectedDate}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                handleChooseDataClick={() => {}}
              />
            </div>
          </div>

          <ScheduleForBox selectedDate={selectedDate} onClear={handleClearSchedule} />
        </div>

        {/* Origination Account */}
        <div className="grid grid-cols-2 pb-1">
          <WrapSelect
            label="Origination Account"
            labelIcon="information-circle"
            placeholder="Select account"
            options={bankAccounts}
            selectedValue={selectedAccount}
            onSelect={(value) => {
              setSelectedAccount(value);
              setOriginationAccountError(false);
            }}
            footerActionLabel="Add New Bank Account"
            showInactiveBadge={false}
            showInactiveNotice={true}
            error={originationAccountError}
            errorMessage="Please select an origination account."
          />
        </div>

        <div className="pt-14">
          <VendorsToPay
            key={`methods-${Object.keys(vendorPaymentMethods).length}-${Object.entries(vendorPaymentMethods).map(([k, v]) => `${k}:${v}`).sort().join(";")}`}
            payment={paymentForVendors}
            vendorPaymentMethods={vendorPaymentMethods}
            vendorPaymentEmails={vendorPaymentEmails}
            vendorPaymentContacts={vendorPaymentContacts}
            vendorBankAccounts={vendorBankAccounts}
            vendorBulkPayment={vendorBulkPayment}
            onSelectPaymentMethodClick={(vendorName, isBulkPayment) => {
              setVendorSelectingPaymentMethod(vendorName);
              setVendorBulkPaymentForModal(isBulkPayment ?? false);
              setIsSelectPaymentMethodModalOpen(true);
            }}
            onBulkPaymentChange={(vendorName, enabled) => {
              setVendorBulkPayment((prev) => ({
                ...prev,
                [vendorName]: enabled,
              }));
            }}
            onDiscardPaymentMethod={resetVendorData}
          />
        </div>
      </div>

      <SelectPaymentMethodModal
        open={isSelectPaymentMethodModalOpen}
        onClose={() => {
          setIsSelectPaymentMethodModalOpen(false);
          setVendorSelectingPaymentMethod(null);
        }}
        onConfirm={(data) => {
          const vendorName = vendorSelectingPaymentMethod;
          if (vendorName) {
            setVendorPaymentMethods((prev) => ({
              ...prev,
              [vendorName]: data.paymentMethodLabel,
            }));
            // Сохраняем контакты для SMART Disburse
            if (data.contacts && data.contacts.length > 0) {
              setVendorPaymentContacts((prev) => ({
                ...prev,
                [vendorName]: data.contacts!,
              }));
              // Также сохраняем первый контакт как email для обратной совместимости
              const firstContact = data.contacts[0];
              setVendorPaymentEmails((prev) => ({
                ...prev,
                [vendorName]: firstContact.value,
              }));
            } else if (data.email) {
              setVendorPaymentEmails((prev) => ({
                ...prev,
                [vendorName]: data.email!,
              }));
            }
            if (data.bankAccount && data.bankAccountLabel) {
              setVendorBankAccounts((prev) => ({
                ...prev,
                [vendorName]: {
                  value: data.bankAccount!,
                  label: data.bankAccountLabel!,
                },
              }));
            }
          }
          setIsSelectPaymentMethodModalOpen(false);
          setVendorSelectingPaymentMethod(null);
        }}
        payables={
          vendorSelectingPaymentMethod
            ? paymentForVendors.vendors?.find(
                (v) => v.name === vendorSelectingPaymentMethod
              )?.payables
            : undefined
        }
        initialEmail={
          vendorSelectingPaymentMethod
            ? vendorPaymentEmails[vendorSelectingPaymentMethod] ?? ""
            : ""
        }
        initialContacts={
          vendorSelectingPaymentMethod
            ? vendorPaymentContacts[vendorSelectingPaymentMethod]
            : undefined
        }
        initialPaymentMethod={
          vendorSelectingPaymentMethod
            ? mapPaymentMethodToValue(
                vendorPaymentMethods[vendorSelectingPaymentMethod] ??
                paymentForVendors.vendors?.find(
                  (v) => v.name === vendorSelectingPaymentMethod
                )?.paymentMethod ?? ""
              )
            : ""
        }
        initialBankAccount={
          vendorSelectingPaymentMethod
            ? vendorBankAccounts[vendorSelectingPaymentMethod]?.value ?? ""
            : ""
        }
        isBulkPayment={vendorBulkPaymentForModal}
      />

      <ConfirmPaymentModal
        open={isConfirmPaymentModalOpen}
        onClose={() => setIsConfirmPaymentModalOpen(false)}
        onConfirm={() => {
          setIsConfirmPaymentModalOpen(false);
          setIsPaymentSubmittedModalOpen(true);
        }}
        totalAmountFormatted={`$${totalFormatted}`}
        amountValute="USD"
        originationAccountLabel={selectedBankAccount?.label ?? ""}
        originationAccountMasked={
          selectedBankAccount?.description
            ? "••••" + (selectedBankAccount.description.match(/\d{4}/)?.[0] ?? "")
            : ""
        }
        vendors={confirmModalVendors}
        isBulkPayment={Object.values(vendorBulkPayment).some(enabled => enabled)}
      />

      <PaymentSubmittedModal
        open={isPaymentSubmittedModalOpen}
        onClose={() => setIsPaymentSubmittedModalOpen(false)}
        handlePaymentSubmittedClick={() => {
          setIsPaymentSubmittedModalOpen(false);
          navigate(-1);
        }}
      />
    </Box>
  );
};

export default MultiplePaymentPage;