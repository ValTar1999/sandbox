import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useParams, useNavigate } from "react-router-dom";
import { payments, Payment } from "./BillsPayables/data";
import Button from "../component/base/Button";
import Badge from "../component/base/Badge";
import Icon from "../component/base/Icon";
import CheckBox from "../component/base/CheckBox";
import { RefreshButton } from "../component/base/RefreshButton";
import Box from "../component/layout/Box";
import Accordion from "../component/dropdowns/Accordion";
import DropdownCalendar from "../component/dropdowns/DropdownCalendar";
import WrapSelect from "../component/base/WrapSelect";
import AccountDetails from "../component/modules/AccountDetails";
import SmartDisburseIcon from "../assets/image/SMART-Disburse.svg";
import MastercardIcon from "../assets/image/mastercard-flag.svg";
import InfoBox from '../component/base/InfoBox';
import VendorsToPay from '../component/dropdowns/VendorsToPay';
import MultiPartyPaymentPage from "./Payment/MultiPartyPaymentPage";

// Modal
import PayModal from "../modals/PayModal";
import PaymentSubmittedModal from "../modals/PaymentSubmittedModal";
import ChooseDataModal from "../modals/ChooseDataModal";

interface PayableSummaryItem {
  item: string;
  quantity: number;
  price: string;
  amount: string;
}

type SmartDisburseContact = {
  id: string;
  type: "email" | "phone";
  value: string;
  label?: string;
  subLabel?: string;
};

function hasPayableSummary(payment: Payment): payment is Payment & { payableSummary: PayableSummaryItem[] } {
  return payment.payableSummary !== undefined;
}

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

const paymentMethods = [
  { label: "ACH", value: "ach", description: "1–3 business days", badge: "Recommended" },
  { label: "Wire", value: "wire", description: "Same business day" },
  { label: "Pay with Card", value: "card" },
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
    inactiveDescription:
      "Payment method is not available for this bank account. Please select another bank account or contact support for more information.",
  },
  {
    label: "Check",
    value: "check",
    inactive: true,
    inactiveDescription:
      "Payment method is not available for this bank account. Please select another bank account or contact support for more information.",
  },
  {
    label: "SMART Exchange",
    value: "smart",
    inactive: true,
    inactiveDescription:
      "Payment method is not available for this bank account. Please select another bank account or contact support for more information.",
  },
];

const achBankAccounts = [
  {
    label: "Wells Fargo Account",
    value: "wells-fargo",
    description: "••••8419",
    descriptionPosition: "below" as const,
    icon: "library",
  },
  {
    label: "Citibank Account",
    value: "citibank",
    description: "••••3674",
    descriptionPosition: "below" as const,
    icon: "library",
  },
];

const cardOptionIcon = {
  iconImageSrc: MastercardIcon,
  iconImageAlt: "Mastercard",
  iconImageClassName: "w-6 h-4",
};

const cardAccounts = [
  {
    label: "Insurance #1 •••• 4708",
    value: "insurance-1",
    description: "Expires 12/2026",
    descriptionPosition: "below" as const,
    rightValue: "$12,034.50",
    badge: "Single use",
    badgeColor: "gray" as const,
    badgePosition: "inline" as const,
    badgeSize: "sm" as const,
    ...cardOptionIcon,
  },
  {
    label: "Insurance #4 •••• 4657",
    value: "insurance-4",
    description: "Expires 12/2026",
    descriptionPosition: "below" as const,
    rightValue: "$23,050.00",
    badge: "Reloadable",
    badgeColor: "gray" as const,
    badgeIcon: "information-circle",
    badgeIconDirection: "right" as const,
    badgePosition: "inline" as const,
    badgeSize: "sm" as const,
    ...cardOptionIcon,
  },
  {
    label: "Online Purchases •••• 0011",
    value: "online-purchases",
    description: "Expires 12/2026",
    descriptionPosition: "below" as const,
    rightValue: "$1,340.00",
    ...cardOptionIcon,
  },
  {
    label: "Universal #5 •••• 1021",
    value: "universal-5",
    description: "Expires 12/2026",
    descriptionPosition: "below" as const,
    rightValue: "$1,340.00",
    ...cardOptionIcon,
  },
];

const fundingMethods = [
  {
    label: "Match Payment",
    value: "match-payment",
    description: "Fund the virtual card with the exact payment amount.",
    descriptionPosition: "below" as const,
  },
  {
    label: "Add Funds",
    value: "add-funds",
    description: "Fund this card with another specific amount.",
    descriptionPosition: "below" as const,
  },
  {
    label: "Spend Balance",
    value: "spend-balance",
    description: "Make payment with existing money on the card.",
    descriptionPosition: "below" as const,
    badge: "Not enough funds",
    badgeColor: "yellow" as const,
    badgePosition: "inline" as const,
    badgeSize: "sm" as const,
    inactive: true,
  },
];

const sendingMethods = [
  {
    value: "on-file",
    label: "Do nothing, card is on file with my vendor",
  },
  {
    value: "delivery",
    label: "Send securely via Delivery Website",
  },
  {
    value: "display",
    label: "Display the card details",
    hasInfo: true,
  },
];

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

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isPaymentSubmittedModalOpen, setIsPaymentSubmittedModalOpen] = useState(false);
  const [isChooseDataModalOpen, setIsChooseDataModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedAchAccount, setSelectedAchAccount] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedFundingMethod, setSelectedFundingMethod] = useState("");
  const [selectedSendingMethod, setSelectedSendingMethod] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [smartDisburseQuery, setSmartDisburseQuery] = useState("");
  const [selectedSmartDisburseContacts, setSelectedSmartDisburseContacts] =
    useState<SmartDisburseContact[]>([]);
  const [isSmartDisburseDropdownOpen, setIsSmartDisburseDropdownOpen] = useState(false);
  const [isSmartDisburseInputFocused, setIsSmartDisburseInputFocused] = useState(false);
  
  const payment = useMemo(() => payments.find(p => p.id === id), [id]);
  
  // Мемоизированные булевы флаги
  const isCardMethod = useMemo(() => selectedMethod === "card", [selectedMethod]);
  const isAchOrWire = useMemo(() => selectedMethod === "ach" || selectedMethod === "wire", [selectedMethod]);
  const isSmartDisburse = useMemo(() => selectedMethod === "smart-disburse", [selectedMethod]);
  
  const needsBankAccount = isAchOrWire;
  const needsCard = isCardMethod;
  const needsFundingMethod = isCardMethod;
  const needsSendingMethod = isCardMethod;
  const needsContactAddress = useMemo(
    () => isCardMethod && selectedSendingMethod === "delivery",
    [isCardMethod, selectedSendingMethod]
  );
  
  const [addFundsAmount, setAddFundsAmount] = useState(0);
  
  const formatCurrency = useCallback((value: number) =>
    `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`, []);
  
  const fundingAmountValue = useMemo(() => {
    if (selectedFundingMethod === "match-payment") return "$8,065.50";
    if (selectedFundingMethod === "add-funds") return formatCurrency(addFundsAmount);
    return "$12,034.50";
  }, [selectedFundingMethod, addFundsAmount, formatCurrency]);
  
  const projectedBalanceAmount = useMemo(() =>
    selectedFundingMethod && selectedFundingMethod !== "spend-balance"
      ? "$20,100.00"
      : "$12,034.50",
    [selectedFundingMethod]
  );

  const handleSendingMethodSelect = useCallback((value: string) => {
    setSelectedSendingMethod(value);
    setShowErrors(false);
  }, []);

  // Мемоизация флагов выбранных типов контактов
  const smartDisburseContactTypes = useMemo(() => ({
    hasEmail: selectedSmartDisburseContacts.some((item) => item.type === "email"),
    hasPhone: selectedSmartDisburseContacts.some((item) => item.type === "phone"),
    selectedIds: new Set(selectedSmartDisburseContacts.map((item) => item.id)),
  }), [selectedSmartDisburseContacts]);

  const filteredSmartDisburseContacts = useMemo(() => {
    const query = smartDisburseQuery.trim().toLowerCase();
    const { selectedIds, hasEmail, hasPhone } = smartDisburseContactTypes;
    
    return smartDisburseContacts.filter((item) => {
      if (selectedIds.has(item.id)) return false;
      if (item.type === "email" && hasEmail) return false;
      if (item.type === "phone" && hasPhone) return false;
      if (!query && !isSmartDisburseDropdownOpen) return false;
      if (!query) return true;
      return (
        item.value.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query) ||
        item.subLabel?.toLowerCase().includes(query)
      );
    });
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
    setShowErrors(false);
  }, []);

  const handleSmartDisburseRemove = useCallback((id: string) => {
    setSelectedSmartDisburseContacts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSmartDisburseInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSmartDisburseContacts.length < 2) {
      setSmartDisburseQuery(event.target.value);
      setIsSmartDisburseDropdownOpen(true);
      setShowErrors(false);
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseInputFocus = useCallback(() => {
    setIsSmartDisburseInputFocused(true);
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseInputBlur = useCallback(() => {
    setIsSmartDisburseInputFocused(false);
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
      document.getElementById("smart-disburse-input")?.focus();
    }
  }, [selectedSmartDisburseContacts.length]);

  const handleSmartDisburseContainerClick = useCallback(() => {
    document.getElementById("smart-disburse-input")?.focus();
    if (selectedSmartDisburseContacts.length < 2) {
      setIsSmartDisburseDropdownOpen(true);
    }
  }, [selectedSmartDisburseContacts.length]);

  const smartDisbursePlaceholder = useMemo(
    () => selectedSmartDisburseContacts.length === 0 && !isSmartDisburseInputFocused ? "Email address or phone number" : "",
    [selectedSmartDisburseContacts.length, isSmartDisburseInputFocused]
  );

  const smartDisburseContainerClassName = useMemo(() => clsx(
    "mt-1 flex flex-wrap items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm text-base placeholder-gray-400",
    "cursor-text",
    showErrors && selectedSmartDisburseContacts.length === 0
      ? "border-red-300 ring-1 ring-red-300"
      : isSmartDisburseInputFocused || isSmartDisburseDropdownOpen
        ? "border-blue-600 ring-1 ring-blue-600"
        : "border-gray-300"
  ), [showErrors, selectedSmartDisburseContacts.length, isSmartDisburseInputFocused, isSmartDisburseDropdownOpen]);

  const smartDisburseInputRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      smartDisburseInputRef.current &&
      !smartDisburseInputRef.current.contains(event.target as Node)
    ) {
      setIsSmartDisburseDropdownOpen(false);
      setIsSmartDisburseInputFocused(false);
    }
  }, []);

  useEffect(() => {
    if (isSmartDisburseDropdownOpen || isSmartDisburseInputFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSmartDisburseDropdownOpen, isSmartDisburseInputFocused, handleClickOutside]);

  const handleCopy = useCallback(() => {
    if (!payment) return;
    navigator.clipboard.writeText(payment.billReference)
      .then(() => alert('Bill reference copied!'))
      .catch(() => alert('Failed to copy.'));
  }, [payment]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Pay Modal
  const handlePayClick = useCallback((payment: typeof payments[0]) => {
    const hasErrors =
      !selectedAccount ||
      !selectedMethod ||
      (needsBankAccount && !selectedAchAccount) ||
      (needsCard && !selectedCard) ||
      (needsFundingMethod && !selectedFundingMethod) ||
      (needsSendingMethod && !selectedSendingMethod) ||
      (needsContactAddress && !contactEmail.trim()) ||
      (isSmartDisburse && selectedSmartDisburseContacts.length === 0);

    if (hasErrors) {
      setShowErrors(true);
      return;
    }

    setSelectedPayment(payment);
    setIsPayModalOpen(true);
  }, [
    selectedAccount,
    selectedMethod,
    needsBankAccount,
    selectedAchAccount,
    needsCard,
    selectedCard,
    needsFundingMethod,
    selectedFundingMethod,
    needsSendingMethod,
    selectedSendingMethod,
    needsContactAddress,
    contactEmail,
    isSmartDisburse,
    selectedSmartDisburseContacts.length,
  ]);

  const handlePayConfirm = useCallback(() => {
    console.log('Processing payment:', selectedPayment);
    setIsPayModalOpen(false);
    setIsPaymentSubmittedModalOpen(true);
  }, [selectedPayment]);

  const handlePayClose = useCallback(() => {
    setIsPayModalOpen(false);
    setSelectedPayment(null);
  }, []);

  // Payment Submitted Modal
  const handlePaymentSubmittedConfirm = useCallback(() => {
    console.log('Cancelling payment:', selectedPayment);
    setIsPaymentSubmittedModalOpen(false);
    setSelectedPayment(null);
  }, [selectedPayment]);

  const handlePaymentSubmittedClose = useCallback(() => {
    setIsPaymentSubmittedModalOpen(false);
    setSelectedPayment(null);
  }, []);

  // Choose Data Modal
  const handleChooseDataClick = useCallback((payment: typeof payments[0]) => {
    setSelectedPayment(payment);
    setIsChooseDataModalOpen(true);
  }, []);

  const handleChooseDataModalConfirm = useCallback(() => {
    console.log('Processing payment:', selectedPayment);
    setIsChooseDataModalOpen(false);
    setSelectedPayment(null);
  }, [selectedPayment]);

  const handleChooseDataModalClose = useCallback(() => {
    setIsChooseDataModalOpen(false);
    setSelectedPayment(null);
  }, []);
  // --------------------------------------------------

  if (!payment) {
    return <div className="p-6 text-red-500">Payment not found</div>;
  }

  if (payment.vendors && payment.vendors.length > 0) {
    return <MultiPartyPaymentPage payment={payment} />;
  }

  // Single bill payment (BillsPayables flow)
  // --------------------------------------------------

  return (
    <Box
      className="max-w-7xl mx-auto"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button variant="add_on" icon="arrow-left" onClick={handleBack}></Button>
            <span className="text-lg font-medium text-gray-900 ml-4">Initiate a Payment</span>
          </div>
          <RefreshButton/>
        </div>
      }
      footer={
        <div className="flex items-center gap-2 w-full justify-end">
          <Button 
            size="md"
            onClick={() => handlePayClick(payment)}
          >
            Pay: {payment.totalAmount}
          </Button>
          <DropdownCalendar 
            dueDate={payment.dueDate} 
            onSelectDate={setSelectedDate} 
            selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex}
            handleChooseDataClick={() => handleChooseDataClick(payment)}
          />
        </div>
      }
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">{payment.totalAmount}</span> <span className="text-gray-500">{payment.amountValute}</span>
              </div>
              {payment.status === "unprocessed" && (
                <Badge icon="flag" iconDirection="left">
                  Unprocessed
                </Badge>
              )}
              {payment.status === "processed" && (
                <Badge color="blue" icon="in-progress" iconDirection="left">
                  Processing
                </Badge>
              )}
              {payment.status === "paid" && (
                <Badge color="green" icon="check-circle" iconDirection="left">
                  Paid
                </Badge>
              )}
              {payment.status === "failed" && (
                <Badge color="red" icon="check-circle" iconDirection="left">
                  Failed
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                size="md"
                onClick={() => handlePayClick(payment)}
              >
                Pay: {payment.totalAmount}</Button>
              <DropdownCalendar
                notification
                dueDate={payment.dueDate} 
                onSelectDate={setSelectedDate} 
                selectedIndex={selectedIndex} 
                setSelectedIndex={setSelectedIndex}
                handleChooseDataClick={() => handleChooseDataClick(payment)}
              />
            </div>
          </div>

          {selectedDate && (
            <div className="flex justify-end mt-2">
              <div className="text-sm font-semibold inline-flex">
                <div className="px-2 flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-300 rounded-l-md">
                  <Icon className="w-4.5 h-4.5" icon="calendar" variant="outline" />
                  <div className="">Schedule for:</div>
                </div>
                <div className="flex items-center border-y border-r border-gray-200 rounded-r-md">
                  <div className="text-blue-600 pl-2">{selectedDate}</div>
                  <Button 
                    size="sm" 
                    icon="x" 
                    variant="add_on" 
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedIndex(null);
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 border-y border-gray-200 py-5">
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">DUE DATE</div>
            <span className="text-base font-gray-700">{payment.dueDate}</span>  
          </div>

          <div className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">VENDOR</div>
            <span className="text-base font-gray-700">{payment.payee}</span>  
          </div>

          <div className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Bill reference</div>
            <div className="flex items-center">
              <span className="text-base font-gray-700">{payment.billReference}</span>  
              <Button size="sm" variant="add_on" icon="clipboard-copy" onClick={handleCopy} />
            </div>
          </div>

          <div className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Attachments</div>
            <Badge>{payment.attachments}</Badge>
          </div>
        </div>

        <div className="pt-6 pb-9 flex space-x-6">
          <div className="w-full">
            <div className="mb-4">           
              <WrapSelect
                label="Origination Account"
                labelIcon="information-circle"
                placeholder="Select account"
                options={bankAccounts}
                selectedValue={selectedAccount}
                onSelect={(value) => {
                  setSelectedAccount(value);
                  setShowErrors(false);
                }}
                footerActionLabel="Add New Bank Account"
                showInactiveBadge={false}
                showInactiveNotice
                error={showErrors && !selectedAccount}
                errorMessage="Origination Account is required."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center items-center min-w-10 h-10 w-10 rounded-full bg-gray-50 ring-2 ring-inset ring-gray-200">
            <Icon icon="arrow-right" className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-full">
            <div className="mb-4">                  
              <WrapSelect
                label="Method of Payment"
                placeholder="Select payment method"
                options={paymentMethods}
                selectedValue={selectedMethod}
                onSelect={(value) => {
                  setSelectedMethod(value);
                  setSelectedCard("");
                  setSelectedFundingMethod("");
                  setSelectedSendingMethod("");
                  setSelectedSmartDisburseContacts([]);
                  setSmartDisburseQuery("");
                  setIsSmartDisburseDropdownOpen(false);
                  setShowErrors(false);
                }}
                showSelectedDescription={false}
                error={showErrors && !selectedMethod}
                errorMessage="Method of Payment is required."
              />
              {isAchOrWire && (
                <div className="mt-4">
                  <WrapSelect
                    label="Bank Account"
                    placeholder="Select bank account"
                    options={achBankAccounts}
                    selectedValue={selectedAchAccount}
                    onSelect={(value) => {
                      setSelectedAchAccount(value);
                      setShowErrors(false);
                    }}
                    footerActionLabel="Add new bank account"
                    error={showErrors && !selectedAchAccount}
                    errorMessage="Bank Account is required."
                  />
                  {selectedAchAccount === "wells-fargo" && 
                  <div className="mt-4">
                    <AccountDetails />
                    <InfoBox
              color="blue"
              icon="information-circle"
                      title='If your Routing Number, Account Number or Address records (as registered under the bank account) are no longer accurate, please update the details in your ERP. Once your details are updated, please "Refresh" to reflect the changes.'
                    />
                  </div>
                  }
                </div>
              )}
              {isCardMethod && (
                <div className="mt-4">
                  <div className="text-sm leading-5 text-gray-500">
                    By choosing this option you can get a cashback of{" "}
                    <span className="text-green-500 font-medium">+$201.00</span>{" "}
                    USD.
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 leading-5">
                      Select a card to pay with
                    </div>
                    <button className="text-xs font-semibold leading-4 cursor-pointer text-gray-900 inline-flex items-center gap-1 hover:text-gray-700 transition-colors duration-300">
                      Manage Cards
                      <Icon icon="arrow-right" className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="mt-2.5 text-sm text-gray-500 leading-5">
                    Simply load your card with the amount of the invoice, and send the card to your
                    customer for a hassle-free checkout experience.
                  </div>
                  <div className="mt-4">
                    <WrapSelect
                      label="Select a card"
                      hideLabel
                      placeholder="Select a card"
                      options={cardAccounts}
                      selectedValue={selectedCard}
                      onSelect={(value) => {
                        setSelectedCard(value);
                        setShowErrors(false);
                      }}
                      footerActionLabel="Create New Card"
                      showSelectedDescription
                      error={showErrors && !selectedCard}
                      errorMessage="Card is required."
                    />
                  </div>
                  {selectedCard && (
                    <>
                      <div className="rounded bg-gray-50 rounded-b-md">
                        <div className="flex items-center p-4 space-x-6">
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              Current Card Balance
                            </div>
                            <div className="text-sm text-gray-900">$12,034.50</div>
                          </div>
                          <span className="w-px h-11 bg-gray-200"></span>
                          <div>
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                              Projected Balance
                            </div>
                            <div
                              className="flex items-center gap-2 text-sm text-gray-900"
                            >
                              <span>{projectedBalanceAmount}</span>
                              {!(selectedFundingMethod === "match-payment" || selectedFundingMethod === "add-funds") && (
                                <Icon icon="exclamation" className="w-4 h-4 text-yellow-500" />
                              )}
                              {(selectedFundingMethod === "match-payment" || selectedFundingMethod === "add-funds") && (
                                <Icon icon="check-circle" className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900 leading-5">
                            Select Funding Method
                          </div>
                          <div className="mt-2">
                            <WrapSelect
                              label="Funding method"
                              hideLabel
                              placeholder="Funding method"
                              options={fundingMethods}
                              selectedValue={selectedFundingMethod}
                              onSelect={(value) => {
                                setSelectedFundingMethod(value);
                                if (value === "add-funds") {
                                  setAddFundsAmount(0);
                                }
                                setShowErrors(false);
                              }}
                              showSelectedDescription={false}
                              showInactiveBadge={false}
                              dropdownClassName="w-[350px]"
                              error={showErrors && !selectedFundingMethod}
                              errorMessage="Funding method is required."
                            />
                          </div>
                        </div>
                        {selectedFundingMethod && (
                          <div>
                            <div className="text-sm font-medium text-gray-900 leading-5">
                              Funding Amount
                            </div>
                            <div className="mt-2">
                              <div
                                className={clsx(
                                  "flex items-center gap-2 rounded-md px-3 py-2 text-base border font-medium transition-all duration-300",
                                  selectedFundingMethod === "add-funds" && addFundsAmount > 0
                                    ? "bg-white text-gray-900 border-blue-600 ring-1 ring-blue-600"
                                    : "bg-gray-50 text-gray-400 border-gray-300"
                                )}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6 1C6 0.447715 5.55228 0 5 0C4.44772 0 4 0.447715 4 1V2.07498C1.65837 2.43371 0 4.03858 0 6C0 7.96142 1.65837 9.56629 4 9.92502V13.9249C3.28531 13.8122 2.77164 13.5905 2.42495 13.3873C2.17592 13.2413 1.7919 12.8893 1.7919 12.8893C1.45935 12.4578 0.840823 12.3714 0.402392 12.6982C-0.0404233 13.0283 -0.131083 13.6558 0.198966 14.0986C0.198966 14.0986 0.436208 14.3705 0.535403 14.4636C0.733832 14.6498 1.02284 14.8837 1.41356 15.1127C2.02986 15.474 2.8817 15.8126 4 15.9433V17C4 17.5523 4.44772 18 5 18C5.55228 18 6 17.5523 6 17V15.9411C7.13889 15.8009 8.05896 15.4132 8.74105 14.8135C9.62019 14.0405 10 13.0047 10 12C10 11.0588 9.72196 10.007 8.85124 9.20286C8.1687 8.57251 7.21875 8.18454 6 8.05167V4.10673C6.50059 4.22046 6.87137 4.40776 7.1328 4.58205C7.34307 4.72223 7.5403 4.88371 7.66856 5.05562C8.00012 5.5 8.59934 5.63563 9.0547 5.33205C9.51423 5.0257 9.6384 4.40483 9.33205 3.9453C9.28101 3.86873 9.12045 3.67298 9.0317 3.579C8.8544 3.39127 8.59443 3.15277 8.2422 2.91795C7.70319 2.55861 6.96224 2.21778 6 2.07298V1ZM4 4.10182C2.58485 4.41216 2 5.36373 2 6C2 6.63627 2.58485 7.58784 4 7.89818V4.10182ZM6 10.0673V13.9203C6.68377 13.8011 7.13397 13.5634 7.42044 13.3115C7.8208 12.9595 8 12.4953 8 12C8 11.4412 7.84175 10.993 7.49432 10.6721C7.23201 10.4299 6.77847 10.1828 6 10.0673Z" fill="#9CA3AF"/>
                                </svg>
                                <input
                                  type="text"
                                  value={fundingAmountValue}
                                  disabled
                                  className="w-full bg-transparent outline-none"
                                />
                              </div>
                              {selectedFundingMethod === "add-funds" && addFundsAmount === 0 && (
                                <div className="mt-2 text-sm text-gray-500">
                                  Deficit offset:{" "}
                                  <button
                                    type="button"
                                    className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-all duration-300"
                                    onClick={() =>
                                      setAddFundsAmount((prev) => prev + 8065.5)
                                    }
                                  >
                                    $8,065.50
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-10">
                        <div className="text-sm font-medium text-gray-700 leading-5">
                          Sending Method
                        </div>
                          <div className="mt-1 grid gap-2.5">
                            {sendingMethods.map((method) => {
                              const isSelected = selectedSendingMethod === method.value;
                              return (
                                <div
                                  key={method.value}
                                  className="rounded-md bg-gray-50 overflow-hidden cursor-pointer"
                                  onClick={() => handleSendingMethodSelect(method.value)}
                                >
                                  <CheckBox
                                    type="radio"
                                    name="sendingMethod"
                                    checked={isSelected}
                                    onChange={() => {
                                      handleSendingMethodSelect(method.value);
                                    }}
                                    wrapperClassName="flex items-center gap-2.5 p-4 cursor-pointer"
                                    labelClassName="text-sm text-gray-900 font-medium leading-5"
                                    label={
                                      <div className="flex items-center gap-2">
                                        <span>
                                          {method.value === "delivery" && isSelected
                                            ? "Send the card details via email or SMS"
                                            : method.label}
                                        </span>
                                        {method.hasInfo && (
                                          <Icon
                                            icon="information-circle"
                                            className="w-3.5 h-3.5 text-gray-400"
                                          />
                                        )}
                                      </div>
                                    }
                                  />
                                  {method.value === "delivery" && isSelected && (
                                    <div className="px-4 pb-4 grid gap-4">
                                      <div className="text-sm text-gray-500 leading-5">
                                        Provide your payee&apos;s email address and/or phone number where the card
                                        token will be sent to.
                                      </div>
                                      <div className="grid gap-1">
                                        <div className="text-sm font-medium text-gray-700 leading-5">
                                          Contact Addresses
                                        </div>
                                        <input
                                          type="text"
                                          value={contactEmail}
                                          onChange={(e) => {
                                            setContactEmail(e.target.value);
                                            setShowErrors(false);
                                          }}
                                          className={clsx(
                                            "w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none",
                                            showErrors &&
                                              selectedSendingMethod === "delivery" &&
                                              !contactEmail.trim()
                                              ? "border-red-300"
                                              : "border-gray-200"
                                          )}
                                        />
                                        {showErrors &&
                                          selectedSendingMethod === "delivery" &&
                                          !contactEmail.trim() && (
                                          <div className="text-sm text-red-500">
                                            Contact address is required.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {method.value === "display" && isSelected && (
                                    <div className="px-4 pb-4 text-sm text-gray-500 leading-5">
                                      Please note that card details will be shown on the final payment confirmation
                                      page after finalizing this invoice for you to send manually.
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        {showErrors && !selectedSendingMethod && (
                          <div className="mt-2 text-sm text-red-500">
                            Sending method is required.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              {isSmartDisburse && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="px-4 py-4">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      Where would you like to send the payment link?
                    </div>
                    <div className="mt-2.5 text-sm leading-5 text-gray-500">
                      Provide your payee&apos;s email address and/or phone number where the SMART
                      Disburse payment token will be sent to.
                    </div>
                    <div 
                      className="mt-4 text-sm font-medium leading-5 text-gray-700 cursor-pointer"
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
                            className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Delete" || e.key === "Backspace") {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSmartDisburseRemove(item.id);
                                // После удаления фокусируем инпут
                                setTimeout(() => {
                                  document.getElementById("smart-disburse-input")?.focus();
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
                        <input
                          id="smart-disburse-input"
                          type="text"
                          value={smartDisburseQuery}
                          readOnly={selectedSmartDisburseContacts.length === 2}
                          onChange={handleSmartDisburseInputChange}
                          onFocus={handleSmartDisburseInputFocus}
                          onBlur={handleSmartDisburseInputBlur}
                          onClick={handleSmartDisburseInputClick}
                          onKeyDown={handleSmartDisburseInputKeyDown}
                          className="min-w-[200px] flex-1 bg-transparent text-sm text-gray-900 outline-none cursor-text"
                          placeholder={smartDisbursePlaceholder}
                        />
                      </div>
                      {showErrors && selectedSmartDisburseContacts.length === 0 && (
                        <div className="mt-1 text-sm text-red-500">
                          Contact address is required.
                        </div>
                      )}
                      {isSmartDisburseDropdownOpen && filteredSmartDisburseContacts.length > 0 && (
                        <div className="absolute left-0 right-0 z-10 mt-1 py-1 rounded-md bg-white shadow-lg max-h-60 overflow-y-auto">
                          {filteredSmartDisburseContacts.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="flex w-full cursor-pointer items-center gap-3 p-4 text-left text-base hover:bg-gray-100 transition-colors duration-300"
                              onClick={() => handleSmartDisburseAdd(item)}
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
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {hasPayableSummary(payment) && (
            <Accordion title="Payable Summary">
              <table className="w-full">
                <thead className="border-b border-dashed border-gray-200">
                  <tr className="text-gray-500 text-xs tracking-wider uppercase">
                    <th className="font-medium text-left py-2 px-6">
                      item ({payment.payableSummary.length})
                    </th>
                    <th className="font-medium text-left py-2 px-6">
                      quantity
                    </th>
                    <th className="font-medium text-right py-2 px-6">
                      unit price
                    </th>
                    <th className="font-medium text-right py-2 px-6">
                      amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {payment.payableSummary.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2 text-sm whitespace-nowrap text-left max-w-64 overflow-hidden text-ellipsis">
                      {item.item}
                    </td>
                    <td className="px-6 py-2 text-sm whitespace-nowrap text-left">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-2 text-sm whitespace-nowrap text-right">
                      {item.price}
                      <span className="pl-1 uppercase text-gray-500">USD</span>
                    </td>
                    <td className="px-6 py-2 text-sm whitespace-nowrap text-right">
                      {item.amount}
                      <span className="pl-1 uppercase text-gray-500">USD</span>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </Accordion>
          )}
          
          {payment.unprocessed && (
          <Accordion title="Activity log">
            <div className="flex items-start">
              <div className="mr-4 pt-1.5">
                <Icon icon="flag" className="h-3.5 w-3.5 text-gray-500"/>
              </div>
              <div className="">
                <div className="text-base font-medium">Unprocessed</div>
                <div className="mt-1 text-sm text-gray-700">
                  <div>
                    Payment for payable ID <a className="text-smart-main hover:text-smart-main-darken hover:underline" href="#">#2345REQ3</a> is pending initiation on 04/22/2022
                  </div>
                </div>
                <div className="mt-1 text-xs font-medium text-gray-400">{payment.unprocessed?.date}</div>
              </div>
            </div>
          </Accordion>
          )}

          {payment.vendors && (
            <VendorsToPay payment={payment} />
          )}
        </div>
        
        <div>
          <PayModal
            open={isPayModalOpen}
            onClose={handlePayClose}
            onConfirm={handlePayConfirm}
            paymentMethod={selectedMethod}
            sendingMethod={selectedSendingMethod}
            contactEmail={contactEmail}
            smartDisburseContacts={selectedSmartDisburseContacts}
          />
          <PaymentSubmittedModal
            open={isPaymentSubmittedModalOpen}
            onClose={handlePaymentSubmittedClose}
            handlePaymentSubmittedClick={handlePaymentSubmittedConfirm}
          />
          <ChooseDataModal
            open={isChooseDataModalOpen}
            onClose={handleChooseDataModalClose}
            onConfirm={handleChooseDataModalConfirm}
            dueDate={payment.dueDate || ''}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSelectDate={setSelectedDate}
          />
        </div>

      </div>
    </Box>
  );
};

export default PaymentPage;


