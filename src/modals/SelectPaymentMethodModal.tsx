import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import clsx from "clsx";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import WrapSelect from "../component/base/WrapSelect";
import Input from "../component/base/Input";
import InfoBox from "../component/base/InfoBox";
import CheckboxField from "../component/modules/CheckboxField";
import Icon from "../component/base/Icon";
import SmartDisburseIcon from "../assets/image/SMART-Disburse.svg";
import { PayableItem } from "../pages/BillsPayables/data";

type SmartDisburseContact = {
  id: string;
  type: "email" | "phone";
  value: string;
  label?: string;
  subLabel?: string;
};

const smartDisburseContacts: SmartDisburseContact[] = [
  { id: "email-1", type: "email", value: "gary@company.eu" },
  { id: "email-2", type: "email", value: "gary.kovalchek@mail.eu" },
  { id: "phone-1", type: "phone", value: "+1 357-22-13546", label: "Main Office" },
  {
    id: "phone-2",
    type: "phone",
    value: "+1 357-22-01546",
    label: "Finances Department",
  },
];

const unavailableMessage =
  "Payment method is not available for this bank account. Please select another bank account or contact support for more information.";

const paymentMethodOptions = [
  { label: "ACH", value: "ach", description: "1–3 business days", badge: "Recommended" },
  { label: "Wire", value: "wire", description: "Same business day" },
  {
    label: "SMART Disburse",
    value: "smart-disburse",
    iconImageSrc: SmartDisburseIcon,
    iconImageAlt: "SMART Disburse",
  },
  {
    label: "RTP",
    value: "rtp",
    inactive: true,
    inactiveDescription: unavailableMessage,
  },
  {
    label: "Check",
    value: "check",
    inactive: true,
    inactiveDescription: unavailableMessage,
  },
  {
    label: "SMART Exchange",
    value: "smart",
    inactive: true,
    inactiveDescription: unavailableMessage,
  },
];

const bankAccountOptions = [
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

interface SelectPaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (data: {
    paymentMethod: string;
    paymentMethodLabel: string;
    bankAccount?: string;
    bankAccountLabel?: string;
    email?: string;
    contacts?: SmartDisburseContact[];
    makeDefault?: boolean;
  }) => void;
  payables?: PayableItem[];
  initialEmail?: string;
  initialContacts?: SmartDisburseContact[];
  initialPaymentMethod?: string;
  initialBankAccount?: string;
  isBulkPayment?: boolean;
}

const SelectPaymentMethodModal: React.FC<SelectPaymentMethodModalProps> = ({
  open,
  onClose,
  onConfirm,
  payables = [],
  initialEmail = "",
  initialContacts,
  initialPaymentMethod = "",
  initialBankAccount = "",
  isBulkPayment = false,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedBankAccount, setSelectedBankAccount] = useState("");
  const [email, setEmail] = useState("gary@company.eu");
  const [selectedSmartDisburseContacts, setSelectedSmartDisburseContacts] = useState<SmartDisburseContact[]>([]);
  const [smartDisburseQuery, setSmartDisburseQuery] = useState("");
  const [isSmartDisburseDropdownOpen, setIsSmartDisburseDropdownOpen] = useState(false);
  const [isSmartDisburseInputFocused, setIsSmartDisburseInputFocused] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const smartDisburseInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedValue(initialPaymentMethod);
      setSelectedBankAccount(initialBankAccount);
      setEmail(initialEmail || "gary@company.eu");
      // Если есть начальные контакты для SMART Disburse, используем их
      if (initialPaymentMethod === "smart-disburse") {
        if (initialContacts && initialContacts.length > 0) {
          setSelectedSmartDisburseContacts(initialContacts);
        } else if (initialEmail) {
          const defaultContact: SmartDisburseContact = {
            id: `email-default-${Date.now()}`,
            type: "email",
            value: initialEmail,
          };
          setSelectedSmartDisburseContacts([defaultContact]);
        } else {
          // Если нет начального email, добавляем дефолтный gary@company.eu
          const defaultContact: SmartDisburseContact = {
            id: `email-default-gary`,
            type: "email",
            value: "gary@company.eu",
          };
          setSelectedSmartDisburseContacts([defaultContact]);
        }
      } else {
        setSelectedSmartDisburseContacts([]);
      }
      setSmartDisburseQuery("");
      setIsSmartDisburseDropdownOpen(false);
      setIsSmartDisburseInputFocused(false);
      setMakeDefault(false);
    }
  }, [open, initialEmail, initialContacts, initialPaymentMethod, initialBankAccount]);

  // Автоматически добавляем дефолтный контакт при выборе SMART Disburse
  useEffect(() => {
    if (selectedValue === "smart-disburse") {
      setSelectedSmartDisburseContacts((prev) => {
        if (prev.length === 0) {
          const defaultContact: SmartDisburseContact = {
            id: `email-default-gary`,
            type: "email",
            value: "gary@company.eu",
          };
          return [defaultContact];
        }
        return prev;
      });
    } else {
      setSelectedSmartDisburseContacts((prev) => {
        if (prev.length > 0) {
          return [];
        }
        return prev;
      });
    }
  }, [selectedValue]);

  // Обработка клика вне области контактов
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        smartDisburseInputRef.current &&
        !smartDisburseInputRef.current.contains(event.target as Node)
      ) {
        setIsSmartDisburseDropdownOpen(false);
        setIsSmartDisburseInputFocused(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  const needsBankAccount = selectedValue === "ach" || selectedValue === "wire";
  const isSmartDisburse = selectedValue === "smart-disburse";

  // Мемоизация флагов выбранных типов контактов
  const smartDisburseContactTypes = useMemo(() => ({
    hasEmail: selectedSmartDisburseContacts.some((item) => item.type === "email"),
    hasPhone: selectedSmartDisburseContacts.some((item) => item.type === "phone"),
    selectedIds: new Set(selectedSmartDisburseContacts.map((item) => item.id)),
  }), [selectedSmartDisburseContacts]);

  const filteredSmartDisburseContacts = useMemo(() => {
    if (!isSmartDisburseDropdownOpen) return [];
    
    const query = smartDisburseQuery.trim().toLowerCase();
    const { selectedIds, hasEmail, hasPhone } = smartDisburseContactTypes;
    
    const filtered = smartDisburseContacts.filter((item) => {
      // Исключаем уже выбранные контакты
      if (selectedIds.has(item.id)) return false;
      // Если уже есть email, не показываем другие email
      if (item.type === "email" && hasEmail) return false;
      // Если уже есть телефон, не показываем другие телефоны
      if (item.type === "phone" && hasPhone) return false;
      // Если нет запроса, показываем все доступные
      if (!query) return true;
      // Фильтруем по запросу
      return (
        item.value.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query) ||
        item.subLabel?.toLowerCase().includes(query)
      );
    });
    
    return filtered;
  }, [smartDisburseQuery, smartDisburseContactTypes, isSmartDisburseDropdownOpen]);

  const handleSmartDisburseAdd = useCallback((item: SmartDisburseContact) => {
    setSelectedSmartDisburseContacts((prev) => {
      const hasEmail = prev.some((contact) => contact.type === "email");
      const hasPhone = prev.some((contact) => contact.type === "phone");
      
      if ((item.type === "email" && hasEmail) || (item.type === "phone" && hasPhone)) {
        return prev;
      }
      
      return [...prev, item];
    });
    setSmartDisburseQuery("");
    setIsSmartDisburseDropdownOpen(false);
  }, []);

  const handleSmartDisburseRemove = useCallback((id: string) => {
    setSelectedSmartDisburseContacts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSmartDisburseInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (selectedSmartDisburseContacts.length < 2) {
      setSmartDisburseQuery(value);
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseInputFocus = useCallback(() => {
    setIsSmartDisburseInputFocused(true);
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  // Открываем dropdown при вводе текста
  useEffect(() => {
    if (smartDisburseQuery.trim() && selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [smartDisburseQuery, selectedSmartDisburseContacts.length]);

  const handleSmartDisburseInputBlur = useCallback(() => {
    setIsSmartDisburseInputFocused(false);
    // Закрываем dropdown с небольшой задержкой, чтобы клик по элементу успел обработаться
    setTimeout(() => {
      if (!smartDisburseInputRef.current?.contains(document.activeElement)) {
        setIsSmartDisburseDropdownOpen(false);
      }
    }, 200);
  }, []);

  const handleSmartDisburseInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const isMaxContacts = selectedSmartDisburseContacts.length === 2;
    const isEmpty = smartDisburseQuery === "";
    const hasContacts = selectedSmartDisburseContacts.length > 0;
    const isDeleteKey = e.key === "Delete" || e.key === "Backspace";
    const isTextKey = e.key.length === 1 && !e.ctrlKey && !e.metaKey;

    // Удаление последнего контакта при пустом инпуте
    if (isDeleteKey && isEmpty && hasContacts) {
      e.preventDefault();
      const lastContact = selectedSmartDisburseContacts[selectedSmartDisburseContacts.length - 1];
      handleSmartDisburseRemove(lastContact.id);
      setSmartDisburseQuery("");
      if (selectedSmartDisburseContacts.length > 1) {
        setIsSmartDisburseDropdownOpen(true);
      }
    }
    // Блокируем ввод текста когда выбраны оба контакта
    if (isMaxContacts && isTextKey) {
      e.preventDefault();
    }
  }, [smartDisburseQuery, selectedSmartDisburseContacts, handleSmartDisburseRemove]);

  const handleSmartDisburseLabelClick = useCallback(() => {
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
      document.getElementById("smart-disburse-input-modal")?.focus();
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseContainerClick = useCallback(() => {
    document.getElementById("smart-disburse-input-modal")?.focus();
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  const smartDisbursePlaceholder = useMemo(
    () => selectedSmartDisburseContacts.length === 0 && !isSmartDisburseInputFocused ? "Email address or phone number" : "",
    [selectedSmartDisburseContacts.length, isSmartDisburseInputFocused]
  );

  const smartDisburseContainerClassName = useMemo(() => clsx(
    "mt-1 flex flex-wrap items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm text-base placeholder-gray-400 min-h-[42px]",
    "cursor-text",
    isSmartDisburseInputFocused || isSmartDisburseDropdownOpen
      ? "border-blue-600 ring-1 ring-blue-600"
      : "border-gray-300"
  ), [isSmartDisburseInputFocused, isSmartDisburseDropdownOpen]);

  if (!open) return null;

  // Проверяем, есть ли несколько разных банковских счетов в payables
  const uniqueBankAccounts = new Set(
    payables
      .map((p) => p.bankAccounts)
      .filter((ba): ba is string => Boolean(ba))
  );
  const hasMultipleBankAccounts = uniqueBankAccounts.size > 1;
  
  // Показываем предупреждение только если bulk payment включен и есть несколько банковских счетов
  const showWarning = isBulkPayment && hasMultipleBankAccounts;

  const isValid =
    selectedValue !== "" &&
    (!needsBankAccount || selectedBankAccount !== "") &&
    (!isSmartDisburse || selectedSmartDisburseContacts.length > 0) &&
    (isSmartDisburse || email.trim() !== "");

  const handleConfirm = () => {
    const option = paymentMethodOptions.find((o) => o.value === selectedValue);
    const bankAccountOption = bankAccountOptions.find(
      (o) => o.value === selectedBankAccount
    );

    onConfirm?.({
      paymentMethod: selectedValue,
      paymentMethodLabel: option?.label ?? selectedValue,
      bankAccount: needsBankAccount ? selectedBankAccount : undefined,
      bankAccountLabel: needsBankAccount
        ? bankAccountOption?.description ?? bankAccountOption?.label
        : undefined,
      email: isSmartDisburse ? undefined : email.trim(),
      contacts: isSmartDisburse ? selectedSmartDisburseContacts : undefined,
      makeDefault: isSmartDisburse ? makeDefault : undefined,
    });
    onClose();
  };

  return (
    <LayoutModal>
      <WrapModal
        className="w-128 flex flex-col"
        header={<div>Select Payment Method</div>}
        onClose={onClose}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleConfirm} disabled={!isValid}>
              Save
            </Button>
          </div>
        }
      >
        <div className="p-6 space-y-6">
          {showWarning && (
            <InfoBox
              color="yellow"
              icon="exclamation"
              title="Multiple receiving bank accounts detected"
              text="To proceed with the bulk payment, please make sure to choose a single receiving bank account."
            />
          )}

          {!isSmartDisburse && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <div className="flex flex-col gap-1 text-sm">
                <div className="font-medium text-gray-900">
                  Who would you like to send the bill to?
                </div>
                <div className="text-gray-500">
                  Please enter the email address or phone number of the payee where the bill will be sent.
                </div>
              </div>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address or phone number"
              />
            </div>
          )}

          <WrapSelect
            label="Method of Payment"
            placeholder="Select payment method"
            options={paymentMethodOptions}
            selectedValue={selectedValue}
            onSelect={setSelectedValue}
            showInactiveBadge
          />

          {isSmartDisburse && (
            <div className="rounded-md bg-gray-50 p-4 space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Where would you like to send the payment link?
                </div>
                <div className="mt-2.5 text-sm text-gray-500">
                  Provide your payee&apos;s email address and/or phone number where the SMART
                  Disburse payment token will be sent to.
                </div>
                <div 
                  className="mt-4 text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={handleSmartDisburseLabelClick}
                >
                  Contact Addresses
                </div>
                <div className="relative" ref={smartDisburseInputRef}>
                  <div
                    className={smartDisburseContainerClassName}
                    onClick={handleSmartDisburseContainerClick}
                  >
                    {selectedSmartDisburseContacts.map((item) => (
                      <span
                        key={item.id}
                        tabIndex={0}
                        role="button"
                        className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-100 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Delete" || e.key === "Backspace") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSmartDisburseRemove(item.id);
                            setTimeout(() => {
                              document.getElementById("smart-disburse-input-modal")?.focus();
                            }, 0);
                          }
                        }}
                      >
                        <Icon
                          icon={item.type === "email" ? "mail" : "phone"}
                          className="h-3.5 w-3.5 text-gray-400"
                        />
                        <span className="text-gray-900 text-sm leading-5">{item.value}</span>
                      </span>
                    ))}
                    {selectedSmartDisburseContacts.length < 2 && (
                      <input
                        id="smart-disburse-input-modal"
                        type="text"
                        value={smartDisburseQuery}
                        onChange={handleSmartDisburseInputChange}
                        onFocus={handleSmartDisburseInputFocus}
                        onBlur={handleSmartDisburseInputBlur}
                        onClick={handleSmartDisburseInputClick}
                        onKeyDown={handleSmartDisburseInputKeyDown}
                        className="min-w-[200px] flex-1 bg-transparent text-sm text-gray-900 outline-none cursor-text"
                        placeholder={smartDisbursePlaceholder}
                      />
                    )}
                  </div>
                  {isSmartDisburseDropdownOpen && filteredSmartDisburseContacts.length > 0 && (
                    <div className="absolute left-0 right-0 z-10 mt-1 py-1 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                      {filteredSmartDisburseContacts.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="flex w-full cursor-pointer items-center gap-3 p-4 text-left text-base hover:bg-gray-100 transition-colors duration-300"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Предотвращаем blur перед кликом
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSmartDisburseAdd(item);
                          }}
                        >
                          <Icon
                            icon={item.type === "email" ? "mail" : "phone"}
                            className="h-5 w-5 text-gray-500"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{item.value}</span>
                            {item.label && (
                              <span className="text-gray-500">{item.label}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isSmartDisburse && (
            <CheckboxField
              checked={true}
              title="Make default payment method"
              subtitle="Checking this means next time you make a payment it will be pre-selected. You can change it anytime in <a href='#' class='text-blue-600 font-medium'>vendor profile</a>."
            />
          )}

          {needsBankAccount && (
            <WrapSelect
              label="Select bank account"
              placeholder="Select bank account"
              options={bankAccountOptions}
              selectedValue={selectedBankAccount}
              onSelect={setSelectedBankAccount}
              showInactiveBadge
            />
          )}
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default SelectPaymentMethodModal;
