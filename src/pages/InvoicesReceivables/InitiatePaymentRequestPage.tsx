import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../component/base/Button";
import Badge from "../../component/base/Badge";
import Icon from "../../component/base/Icon";
import { RefreshButton } from "../../component/base/RefreshButton";
import Box from "../../component/layout/Box";
import Accordion from "../../component/dropdowns/Accordion";
import WrapSelect from "../../component/base/WrapSelect";
import Select, { useSelectContext } from "../../component/base/Select";
import Menu, { useMenuContext } from "../../component/base/Menu";
import DropdownCalendar from "../../component/dropdowns/DropdownCalendar";
import Tooltip, { TooltipTrigger, TooltipContent } from "../../component/base/Tooltip";
import SmartCollectIcon from "../../assets/image/SMART-Collect.svg";
import AddBankAccountModal, {
  type BankAccountFormData,
} from "../../modals/AddBankAccountModal";
import AddCardDetailsModal, {
  type CardDetailsFormData,
} from "../../modals/AddCardDetailsModal";
import SelectPaymentWorkflowModal, {
  workflowOptions,
} from "../../modals/SelectPaymentWorkflowModal";
import SmartCollectDetailsModal from "../../modals/SmartCollectDetailsModal";
import PaymentRequestSubmittedModal from "../../modals/PaymentRequestSubmittedModal";
import MastercardIcon from "../../assets/image/mastercard-flag.svg";
import { receivables, Receivable } from "./data";
import { STATUS_BADGES } from "../../constants/tableStatusBadges";

const SmartCollectTooltipContent = () => (
  <div className="w-[344px] p-4 bg-gray-900 rounded-lg shadow-lg flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      <img src={SmartCollectIcon} alt="" className="w-5 h-5" />
      <span className="text-sm font-normal">
        <span className="font-bold">SMART</span> Collect
      </span>
    </div>
    <p className="text-sm leading-5 text-gray-100">
      Embedded payment solution that allows your business to bill and collect payments from businesses or consumers
    </p>
    <a
      href="#"
      className="inline-flex items-center gap-1 text-sm leading-5 font-semibold text-blue-500 hover:text-blue-300 transition-colors duration-300 cursor-pointer group"
    >
      Learn more
      <Icon icon="arrow-right" className="w-3 h-3 text-blue-500 group-hover:text-blue-300" />
    </a>
  </div>
);

type ContactItem = {
  id: string;
  type: "email" | "phone";
  value: string;
  label?: string;
};

const paymentCollectionOptions = [
  {
    value: "invoice",
    label: "Invoice Customer",
    description: "Present an invoice requesting payment on a specific date.",
    descriptionPosition: "below" as const,
  },
  {
    value: "charge",
    label: "Charge Customer",
    description: "Charge customer immediately.",
    descriptionPosition: "below" as const,
  },
];

const PaymentCollectionSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const selectedOption = paymentCollectionOptions.find((o) => o.value === value);
  return (
    <Menu.Root placement="bottom-end">
      <Menu.Trigger as="span" className="inline-flex">
        <Button
          variant="secondary"
          size="md"
          icon="selector"
          iconDirection="right"
        >
          {selectedOption?.label ?? "Select method"}
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="w-[350px] bg-white border border-gray-100 divide-y divide-gray-200 rounded-md shadow-lg overflow-hidden max-h-[350px] overflow-y-auto">
            {paymentCollectionOptions.map((option) => (
              <PaymentCollectionOption
                key={option.value}
                option={option}
                isSelected={value === option.value}
                onSelect={() => onChange(option.value)}
              />
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const PaymentCollectionOption = ({
  option,
  isSelected,
  onSelect,
}: {
  option: (typeof paymentCollectionOptions)[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const { setOpen } = useMenuContext();
  return (
    <button
      type="button"
      className={clsx(
        "flex w-full items-start gap-3 p-4 text-left cursor-pointer",
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      )}
      onClick={() => {
        onSelect();
        setOpen(false);
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900">{option.label}</div>
        {option.description && (
          <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
        )}
      </div>
      {isSelected && (
        <Icon icon="check" className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
    </button>
  );
};

type AccountOnFile = {
  id: string;
  type: "bank" | "card";
  accountName: string;
  accountNumber: string;
  expiry?: string; // MM/YYYY for cards
  cardBrand?: "mastercard" | "visa";
};

const getCardBrand = (cardNumber: string): "mastercard" | "visa" | undefined => {
  const first = cardNumber.replace(/\D/g, "")[0];
  if (first === "4") return "visa";
  if (first === "5") return "mastercard";
  return undefined;
};

const formatExpiryForDisplay = (expiry: string): string => {
  const digits = expiry.replace(/\D/g, "");
  if (digits.length < 4) return "";
  const mm = digits.slice(0, 2);
  const yy = digits.slice(2, 4);
  const yyyy = parseInt(yy, 10) >= 50 ? `19${yy}` : `20${yy}`;
  return `${mm}/${yyyy}`;
};

const addCustomerAccountOptions = [
  { value: "bank", label: "Add bank account", icon: "library" as const },
  { value: "card", label: "Add card details", icon: "credit-card" as const },
];

const AddCustomerAccountSelect = ({
  onAddBankAccount,
  onAddCardDetails,
  charge = false,
  error = false,
}: {
  onAddBankAccount?: () => void;
  onAddCardDetails?: () => void;
  charge?: boolean;
  error?: boolean;
}) => (
  <div className="flex flex-col gap-1">
  <Menu.Root placement="bottom-start">
    <Menu.Trigger as="span" className="inline-flex">
      <Button
        variant={charge ? "linkPrimary" : "secondary"}
        size="sm"
        icon="plus"
        iconDirection="left"
      >
        Add Customer Account
      </Button>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup className="w-[280px] bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden py-1">
          {addCustomerAccountOptions.map((option) => (
            <AddCustomerAccountOption
              key={option.value}
              option={option}
              onClick={
                option.value === "bank"
                  ? onAddBankAccount
                  : option.value === "card"
                    ? onAddCardDetails
                    : undefined
              }
            />
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
  {error && (
    <span className="text-sm text-red-500">Please add and select an account for payment initiation.</span>
  )}
  </div>
);

const AddCustomerAccountOption = ({
  option,
  onClick,
}: {
  option: (typeof addCustomerAccountOptions)[0];
  onClick?: () => void;
}) => {
  const { setOpen } = useMenuContext();
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm leading-5 text-gray-900 hover:bg-gray-50 cursor-pointer transition-all duration-300"
      onClick={() => {
        setOpen(false);
        onClick?.();
      }}
    >
      <Icon
        icon={option.icon}
        className="w-5 h-5 text-gray-500 flex-shrink-0"
      />
      <span className="font-medium">{option.label}</span>
    </button>
  );
};

const chargeSourceAccountDemo: AccountOnFile[] = [
  {
    id: "demo-card-1",
    type: "card",
    accountName: "Mastercard",
    accountNumber: "****5612",
    expiry: "04/2026",
    cardBrand: "mastercard",
  },
  {
    id: "demo-bank-1",
    type: "bank",
    accountName: "Main Account Details",
    accountNumber: "6789",
  },
  {
    id: "demo-bank-2",
    type: "bank",
    accountName: "Account #1",
    accountNumber: "1111",
  },
  {
    id: "demo-bank-3",
    type: "bank",
    accountName: "Account 3",
    accountNumber: "1010",
  },
];

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

const ContactInputArea = ({
  selectedContacts,
  contactQuery,
  setContactQuery,
  addContact,
  removeContact,
  error,
}: {
  selectedContacts: ContactItem[];
  contactQuery: string;
  setContactQuery: (v: string) => void;
  addContact: (item: ContactItem) => void;
  removeContact: (id: string) => void;
  error?: boolean;
}) => {
  const { setOpen } = useSelectContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = contactQuery.trim();
      if (value) {
        const type = value.includes("@") ? "email" : "phone";
        const id = `${type}-${Date.now()}`;
        addContact({ id, type, value });
        setContactQuery("");
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={-1}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.focus();
        setOpen(true);
      }}
      className={clsx(
        "relative shadow-sm flex flex-wrap min-h-10 rounded-md border px-3 items-center gap-2",
        "text-base font-normal text-gray-800 placeholder-gray-400",
        "focus-within:outline-none focus-within:ring-1 transition duration-300 ease-in-out",
        error
          ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500 placeholder:text-red-300"
          : "border-gray-300 focus-within:border-smart-main focus-within:ring-smart-main"
      )}
    >
      {selectedContacts.map((item) => (
        <Badge
          key={item.id}
          color="gray"
          size="sm"
          icon={item.type === "email" ? "mail" : "phone"}
          iconDirection="left"
          className="max-w-[220px] min-w-0 overflow-hidden gap-1.5"
        >
          <span className="min-w-0 flex-1 truncate">{item.value}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeContact(item.id);
            }}
            className="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors cursor-pointer"
            aria-label="Remove contact"
          >
            <Icon icon="x" className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        placeholder={
          selectedContacts.length === 0
            ? "Email address or phone number"
            : ""
        }
        value={contactQuery}
        onChange={(e) => setContactQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[120px] py-2 text-base font-normal text-gray-800 placeholder-gray-400 outline-none bg-transparent border-0"
      />
    </div>
  );
};

const ContactDropdownContent = ({
  filteredContacts,
  hoveredContactId,
  setHoveredContactId,
  addContact,
}: {
  filteredContacts: ContactItem[];
  hoveredContactId: string | null;
  setHoveredContactId: (id: string | null) => void;
  addContact: (item: ContactItem) => void;
}) => {
  const { open, setOpen } = useSelectContext();
  if (!open || filteredContacts.length === 0) return null;
  return (
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup className="w-full py-1 rounded-md bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
          {filteredContacts.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-300",
                hoveredContactId === item.id && "bg-gray-50"
              )}
              onMouseEnter={() => setHoveredContactId(item.id)}
              onMouseLeave={() => setHoveredContactId(null)}
              onClick={() => {
                addContact(item);
                setOpen(false);
              }}
            >
              <Icon
                icon={item.type === "email" ? "mail" : "phone"}
                className="h-5 w-5 text-gray-500 flex-shrink-0"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-gray-900">{item.value}</span>
                {item.label && (
                  <span className="text-gray-500 text-xs">{item.label}</span>
                )}
              </div>
            </button>
          ))}
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  );
};

const contactSuggestions: ContactItem[] = [
  { id: "email-1", type: "email", value: "gary@company.eu" },
  { id: "email-2", type: "email", value: "gary.kovalchek@mail.eu" },
  {
    id: "phone-1",
    type: "phone",
    value: "+1 357-22-01546",
    label: "Finances Department",
  },
  { id: "phone-2", type: "phone", value: "+1 357-22-01546", label: "CEO" },
  {
    id: "phone-3",
    type: "phone",
    value: "+1 351-65-86764",
    label: "CFO Personal",
  },
];

const InitiatePaymentRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentCollection, setPaymentCollection] = useState("invoice");
  const [contactQuery, setContactQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<ContactItem[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [hoveredContactId, setHoveredContactId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [accountsOnFile, setAccountsOnFile] = useState<AccountOnFile[]>([]);
  const [selectedAccountOnFile, setSelectedAccountOnFile] = useState("");
  const [isAddBankAccountModalOpen, setIsAddBankAccountModalOpen] =
    useState(false);
  const [isAddCardDetailsModalOpen, setIsAddCardDetailsModalOpen] =
    useState(false);
  const [isSelectWorkflowModalOpen, setIsSelectWorkflowModalOpen] =
    useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(
    null
  );
  const [isSmartCollectModalOpen, setIsSmartCollectModalOpen] =
    useState(false);
  const [isPaymentRequestSubmittedOpen, setIsPaymentRequestSubmittedOpen] =
    useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const receivable = useMemo(
    () => receivables.find((r) => r.id === id),
    [id]
  );

  const isFormValid = useMemo(() => {
    if (paymentCollection === "charge") {
      return selectedAccountOnFile !== "";
    }
    return (
      selectedContacts.length > 0 &&
      selectedAccount !== "" &&
      selectedWorkflowId !== null &&
      selectedAccountOnFile !== ""
    );
  }, [
    paymentCollection,
    selectedContacts.length,
    selectedAccount,
    selectedWorkflowId,
    selectedAccountOnFile,
  ]);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  const handleInvoiceClick = useCallback(() => {
    if (isFormValid) {
      setShowErrors(false);
      setIsSmartCollectModalOpen(true);
    } else {
      setShowErrors(true);
    }
  }, [isFormValid]);

  const handleSmartCollectInvoice = useCallback(() => {
    setIsSmartCollectModalOpen(false);
    setIsPaymentRequestSubmittedOpen(true);
  }, []);

  const handlePaymentRequestDone = useCallback(() => {
    setIsPaymentRequestSubmittedOpen(false);
    navigate(-1);
  }, [navigate]);

  const handleCopy = useCallback(() => {
    if (!receivable) return;
    navigator.clipboard
      .writeText(receivable.invoiceNumber)
      .then(() => alert("Bill reference copied!"))
      .catch(() => alert("Failed to copy."));
  }, [receivable]);

  const filteredContacts = useMemo(() => {
    const query = contactQuery.trim().toLowerCase();
    const selectedIds = new Set(selectedContacts.map((c) => c.id));
    const hasEmail = selectedContacts.some((c) => c.type === "email");
    const hasPhone = selectedContacts.some((c) => c.type === "phone");
    const available = contactSuggestions.filter((c) => {
      if (selectedIds.has(c.id)) return false;
      if (c.type === "email" && hasEmail) return false;
      if (c.type === "phone" && hasPhone) return false;
      return true;
    });
    if (!query) return available;
    return available.filter(
      (item) =>
        item.value.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query)
    );
  }, [contactQuery, selectedContacts]);

  const addContact = useCallback((item: ContactItem) => {
    setShowErrors(false);
    setSelectedContacts((prev) => {
      const otherType = prev.filter((c) => c.type !== item.type);
      return [...otherType, item];
    });
    setContactQuery("");
  }, []);

  const removeContact = useCallback((id: string) => {
    setShowErrors(false);
    setSelectedContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleAddBankAccount = useCallback((data: BankAccountFormData) => {
    setShowErrors(false);
    const id = `account-${Date.now()}`;
    setAccountsOnFile((prev) => [
      ...prev,
      {
        id,
        type: "bank",
        accountName: data.accountName || "Account",
        accountNumber: data.accountNumber,
      },
    ]);
    setSelectedAccountOnFile(id);
  }, []);

  const handleAddCardDetails = useCallback((data: CardDetailsFormData) => {
    setShowErrors(false);
    const id = `card-${Date.now()}`;
    const cardNumber = data.cardNumber.replace(/\s/g, "");
    const cardBrand = getCardBrand(cardNumber);
    const expiry = formatExpiryForDisplay(data.expiry);
    setAccountsOnFile((prev) => [
      ...prev,
      {
        id,
        type: "card",
        accountName: cardBrand === "mastercard" ? "Mastercard" : cardBrand === "visa" ? "Visa" : "Mastercard",
        accountNumber: cardNumber,
        expiry,
        cardBrand,
      },
    ]);
    setSelectedAccountOnFile(id);
  }, []);

  const renderStatusBadge = (status: Receivable["status"]) => {
    const config = STATUS_BADGES[status];
    if (!config) return null;
    return (
      <Badge color={config.color} icon={config.icon} iconDirection="left">
        {config.label}
      </Badge>
    );
  };

  if (!receivable) {
    return <div className="p-6 text-red-500">Receivable not found</div>;
  }

  const attachmentsDisplay = receivable.attachments?.length
    ? receivable.attachments.join(", ")
    : "-";

  return (
    <Box
      className="max-w-7xl mx-auto"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button variant="add_on" icon="arrow-left" onClick={handleBack} />
            <span className="text-lg font-medium text-gray-900 ml-4">
              Initiate Payment Request
            </span>
          </div>
          <RefreshButton />
        </div>
      }
      footer={
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center flex-wrap justify-end w-full">
            <span className="text-sm leading-5 text-gray-700 mr-4">Payment Collection</span>
            <PaymentCollectionSelect
              value={paymentCollection}
              onChange={setPaymentCollection}
            />
            <div className="flex h-8 mx-6 w-px bg-gray-300" />
            <Button
              size="md"
              variant="primary"
              onClick={handleInvoiceClick}
            >
              Invoice: {receivable.amount}
            </Button>
            <div className="ml-2">
              <DropdownCalendar
                dueDate={receivable.due}
                onSelectDate={setSelectedDate}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                handleChooseDataClick={() => {}}
              />
            </div>
          </div>
          {selectedDate && (
            <div className="flex justify-end">
              <div className="text-sm font-semibold inline-flex">
                <div className="px-2 flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-300 rounded-l-md">
                  <Icon className="w-4.5 h-4.5" icon="calendar" variant="outline" />
                  <span>Schedule for:</span>
                </div>
                <div className="flex items-center border-y border-r border-gray-200 rounded-r-md">
                  <span className="text-blue-600 pl-2">{selectedDate}</span>
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
      }
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">{receivable.amount}</span>{" "}
                <span className="text-gray-500">{receivable.amountCurrency}</span>
              </div>
              {renderStatusBadge(receivable.status)}
            </div>
            <div className="flex items-center">
              <span className="text-sm leading-5 text-gray-700 mr-4">Payment Collection</span>
              <PaymentCollectionSelect
                value={paymentCollection}
                onChange={setPaymentCollection}
              />
              <div className="flex h-8 mx-6 w-px bg-gray-300" />
              <Button
                size="md"
                variant="primary"
                onClick={handleInvoiceClick}
              >
                Invoice: {receivable.amount}
              </Button>
              <div className="ml-2">
                <DropdownCalendar
                  dueDate={receivable.due}
                  onSelectDate={setSelectedDate}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  handleChooseDataClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-y border-gray-200 py-5">
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              DUE DATE
            </div>
            <span className="text-base text-gray-700">{receivable.due}</span>
          </div>
          <div className="flex h-auto w-px bg-gray-300" />
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              CUSTOMER
            </div>
            <span className="text-base text-gray-700">{receivable.customer}</span>
          </div>
          <div className="flex h-auto w-px bg-gray-300" />
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              BILL REFERENCE
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="document-text" className="w-4 h-4 text-gray-400" />
              <span className="text-base text-gray-700">
                {receivable.invoiceNumber}
              </span>
              <Button
                size="sm"
                variant="add_on"
                icon="clipboard-copy"
                onClick={handleCopy}
              />
            </div>
          </div>
          <div className="flex h-auto w-px bg-gray-300" />
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              ATTACHMENTS
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="document-text" className="w-4 h-4 text-gray-400" />
              <span className="text-base text-gray-700">{attachmentsDisplay}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 pb-[66px] flex flex-col w-full">
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-22 w-full ">
              <div 
              className={clsx("w-full", paymentCollection === "charge" && "max-w-[572px]")}>
                <div className="text-base font-medium text-gray-900 mb-1">
                  {paymentCollection === "charge" ? "Charge Customer" : "Customer Details"}                
                </div>
                {paymentCollection === "charge" ? (
                  <div className="text-sm leading-5 text-gray-500">
                    Select customer account details you want to make the charge for this invoice. Transaction will be initiated immediately. Ensure you have consent from the customer to charge them on this account.
                  </div>
                ) : (
                <div className="text-sm leading-5 text-gray-500">
                  Provide your payor&apos;s email address and/or phone number where
                  the{" "}
                  <Tooltip trigger="hover" placement="top">
                    <TooltipTrigger as="span" className="inline-flex cursor-help">
                      <strong className="font-semibold text-gray-700">SMART Collect</strong>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 bg-transparent border-0 shadow-none">
                      <SmartCollectTooltipContent />
                    </TooltipContent>
                  </Tooltip>{" "}
                  workflow will be sent to.
                </div>
                )}
              </div>
               {paymentCollection === "invoice" && (
                <div className="w-full">
                  <div className="text-base font-medium text-gray-900 mb-1">
                    Receiving Account
                  </div>
                  <div className="text-sm leading-5 text-gray-500">
                    This account serves as the destination for funds charged from the
                    customer for ACH receivables.
                  </div>
                </div>
               )}
              {paymentCollection === "charge" && selectedAccountOnFile && (
              <div className="w-full">
                <div className="text-base font-medium text-gray-900 mb-1">
                  Merchant Services Account
                </div>
                <div className="text-sm leading-5 text-gray-500">
                  This account serves as the destination for funds charged from the customer for credit and debit card transactions.
                </div>
              </div>
              )}

            </div>

            <div className="flex items-start gap-6 w-full">
              <div className="relative w-full">
                {paymentCollection === "invoice" ? (
                  <>
                    <Select.Root placement="bottom-start">
                      <Select.Trigger
                        as="span"
                        className="block w-full cursor-text"
                        onClick={() => setShowErrors(false)}
                      >
                        <ContactInputArea
                          selectedContacts={selectedContacts}
                          contactQuery={contactQuery}
                          setContactQuery={setContactQuery}
                          addContact={addContact}
                          removeContact={removeContact}
                          error={showErrors && paymentCollection === "invoice" && selectedContacts.length === 0}
                        />
                      </Select.Trigger>
                      <ContactDropdownContent
                        filteredContacts={filteredContacts}
                        hoveredContactId={hoveredContactId}
                        setHoveredContactId={setHoveredContactId}
                        addContact={addContact}
                      />
                    </Select.Root>
                    {showErrors && paymentCollection === "invoice" && selectedContacts.length === 0 && (
                      <span className="mt-1 block text-sm text-red-500">Email address or phone number is required.</span>
                    )}
                    <div className="mt-1 flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm leading-5">
                        <span className="text-gray-500">
                          {selectedWorkflowId
                            ? "Selected payment workflow:"
                            : "Payment workflow:"}
                        </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowErrors(false);
                          setIsSelectWorkflowModalOpen(true);
                        }}
                        className={clsx(
                          "inline-flex items-center gap-1 transition-colors duration-300 cursor-pointer font-semibold",
                          showErrors && paymentCollection === "invoice" && !selectedWorkflowId
                            ? "text-red-600 hover:text-red-700"
                            : "text-blue-600 hover:text-blue-700"
                        )}
                      >
                        {selectedWorkflowId
                          ? workflowOptions.find(
                              (o) => o.id === selectedWorkflowId
                            )?.title ?? "Standard SMART Collect"
                          : "Select Workflow"}
                        <Icon icon="arrow-right" className="w-3 h-3" />
                      </button>
                      </div>
                      {showErrors && paymentCollection === "invoice" && !selectedWorkflowId && (
                        <span className="text-sm text-red-500">Payment workflow is required.</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={clsx("flex flex-col gap-3", paymentCollection === "charge" && "max-w-[572px]")}>
                    <WrapSelect
                      placeholder="Select source account for fund retrieval"
                      triggerBadgeMode="defaultOnly"
                      error={showErrors && paymentCollection === "charge" && !selectedAccountOnFile}
                      errorMessage="Please select an account for fund retrieval."
                      options={(accountsOnFile.length > 0 ? accountsOnFile : chargeSourceAccountDemo).map((acc, index) => {
                        const lastFour = acc.accountNumber.replace(/\s/g, "").slice(-4) || "----";
                        const isCard = acc.type === "card";
                        const isFirst = index === 0;
                        const label = isCard
                          ? `${acc.accountName} •••• ${lastFour}`
                          : acc.accountName;
                        const description = isCard && acc.expiry
                          ? `Expires ${acc.expiry}`
                          : `Bank AG ••••${lastFour}`;
                        const isDefault = selectedAccountOnFile === acc.id;
                        return {
                          label,
                          value: acc.id,
                          description,
                          descriptionPosition: "below" as const,
                          icon: !isCard ? "library" : undefined,
                          iconImageSrc: isCard ? MastercardIcon : undefined,
                          iconImageAlt: acc.accountName,
                          iconImageClassName: isCard ? "h-4 w-5 flex-shrink-0" : undefined,
                          badge: isFirst ? "SMART Collect" : undefined,
                          badgeSecondary: (isCard && isDefault) || isFirst ? "Default" : undefined,
                          badgeSecondaryTooltip: (isCard && isDefault) || isFirst ? (<>This is the default payment method that the customer has set through <strong>SMART Collect</strong>.</>) : undefined,
                          badgeColor: "gray" as const,
                          badgeSecondaryColor: "blue" as const,
                          badgePosition: "inline" as const,
                          badgeRounded: false,
                          badgeSecondaryRounded: false,
                        };
                      })}
                      selectedValue={selectedAccountOnFile}
                      onSelect={(v) => {
                        setShowErrors(false);
                        setSelectedAccountOnFile(v);
                      }}
                    />
                    <AddCustomerAccountSelect
                      charge
                      onAddBankAccount={() => setIsAddBankAccountModalOpen(true)}
                      onAddCardDetails={() => setIsAddCardDetailsModalOpen(true)}
                    />
                  </div>
                )}
              </div>

              {paymentCollection === "invoice" || (paymentCollection === "charge" && selectedAccountOnFile) ? (
                <>
                  <div className="flex justify-center items-center min-w-10 h-10 w-10 rounded-full bg-gray-50 ring-2 ring-inset ring-gray-200 flex-shrink-0">
                    <Icon icon="arrow-right" className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="w-full">
                    {paymentCollection === "invoice" ? (
                      <WrapSelect
                        placeholder="Select bank account"
                        options={bankAccounts}
                        selectedValue={selectedAccount}
                        onSelect={(v) => {
                          setShowErrors(false);
                          setSelectedAccount(v);
                        }}
                        error={showErrors && paymentCollection === "invoice" && !selectedAccount}
                        errorMessage="Receiving account is required."
                        footerActionLabel="Add New Bank Account"
                        onFooterActionClick={() => {}}
                        showInactiveNotice
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 text-base font-medium cursor-default select-none">
                        Merchant Account ID #4569
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
          {paymentCollection === "invoice" && (
            <div className="mt-8 p-4 rounded-md bg-gray-50 w-full max-w-[572px]">
              <div className="text-base font-medium text-gray-900 mb-1">
                Accounts on File
              </div>
              <div className="text-sm leading-5 text-gray-500 mb-4">
                Add a new account for payment initiation.
              </div>
              {accountsOnFile.length > 0 && (
                <div className="mb-4">
                  <WrapSelect
                    placeholder="Select account"
                    error={showErrors && paymentCollection === "invoice" && !selectedAccountOnFile}
                    errorMessage="Accounts on File: please select an account."
                    options={accountsOnFile.map((acc) => {
                      const lastFour = acc.accountNumber.replace(/\s/g, "").slice(-4) || "----";
                      const isCard = acc.type === "card";
                      const label = isCard
                        ? `${acc.accountName} ••• ${lastFour}`
                        : `${acc.accountName} ••••${lastFour}`;
                      return {
                        label,
                        value: acc.id,
                        description: isCard && acc.expiry ? acc.expiry : undefined,
                        descriptionPosition: isCard ? ("inline" as const) : undefined,
                        icon: !isCard ? "library" : undefined,
                        iconImageSrc: isCard ? MastercardIcon : undefined,
                        iconImageAlt: acc.accountName,
                        iconImageClassName: isCard ? "h-4 w-5 flex-shrink-0" : undefined,
                        badge: isCard && selectedAccountOnFile === acc.id ? "Default" : undefined,
                        badgeColor: "blue" as const,
                        badgePosition: "right" as const,
                      };
                    })}
                    selectedValue={selectedAccountOnFile}
                    onSelect={(v) => {
                      setShowErrors(false);
                      setSelectedAccountOnFile(v);
                    }}
                  />
                </div>
              )}
              <AddCustomerAccountSelect
                onAddBankAccount={() => setIsAddBankAccountModalOpen(true)}
                onAddCardDetails={() => setIsAddCardDetailsModalOpen(true)}
                error={showErrors && paymentCollection === "invoice" && !selectedAccountOnFile}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {receivable.receivableSummary &&
            receivable.receivableSummary.length > 0 && (
              <Accordion
                title='Receivable Summary'
              >
                <table className="w-full">
                  <thead className="border-b border-dashed border-gray-200">
                    <tr className="text-gray-500 text-xs tracking-wider uppercase">
                      <th className="font-medium text-left py-2 px-6">ITEM ({receivable.receivableSummary.length})</th>
                      <th className="font-medium text-left py-2 px-6">
                        QUANTITY
                      </th>
                      <th className="font-medium text-right py-2 px-6">
                        UNIT PRICE
                      </th>
                      <th className="font-medium text-right py-2 px-6">
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {receivable.receivableSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-2 text-sm whitespace-nowrap text-left max-w-64 overflow-hidden text-ellipsis">
                          {item.item}
                        </td>
                        <td className="px-6 py-2 text-sm whitespace-nowrap text-left">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-2 text-sm whitespace-nowrap text-right">
                          {item.price}{" "}
                          <span className="uppercase text-gray-500">
                            {receivable.amountCurrency}
                          </span>
                        </td>
                        <td className="px-6 py-2 text-sm whitespace-nowrap text-right">
                          {item.amount}{" "}
                          <span className="uppercase text-gray-500">
                            {receivable.amountCurrency}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>
            )}

          {receivable.activityLog && receivable.activityLog.length > 0 && (
            <Accordion title="Activity Log">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1.5">
                  <Icon icon="flag" className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div>
                  {receivable.activityLog.map((item) => (
                    <div key={item.id}>
                      <div className="text-base font-medium">Unprocessed</div>
                      <div className="mt-1 text-sm text-gray-700">
                        {item.description.split(/(#\w+)/g).map((part, i) =>
                          part.match(/^#\w+$/) ? (
                            <a
                              key={i}
                              href="#"
                              className="text-blue-600 font-medium hover:underline"
                            >
                              {part}
                            </a>
                          ) : (
                            part
                          )
                        )}
                      </div>
                      <div className="mt-1 text-xs font-medium text-gray-400">
                        {item.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion>
          )}
        </div>
      </div>

      <AddBankAccountModal
        open={isAddBankAccountModalOpen}
        onClose={() => setIsAddBankAccountModalOpen(false)}
        onAdd={handleAddBankAccount}
      />
      <AddCardDetailsModal
        open={isAddCardDetailsModalOpen}
        onClose={() => setIsAddCardDetailsModalOpen(false)}
        onAdd={handleAddCardDetails}
      />
      <SelectPaymentWorkflowModal
        open={isSelectWorkflowModalOpen}
        onClose={() => setIsSelectWorkflowModalOpen(false)}
        selectedWorkflowId={selectedWorkflowId}
        onSave={(workflowId) => {
          setShowErrors(false);
          setSelectedWorkflowId(workflowId);
        }}
      />
      <SmartCollectDetailsModal
        open={isSmartCollectModalOpen}
        onClose={() => setIsSmartCollectModalOpen(false)}
        onInvoice={handleSmartCollectInvoice}
        amount={receivable?.amount ?? ""}
        amountCurrency={receivable?.amountCurrency ?? "USD"}
        contactAddress={selectedContacts[0]?.value ?? ""}
        paymentWorkflow={
          workflowOptions.find((o) => o.id === selectedWorkflowId)?.title ??
          "SMART Collect"
        }
        isCharge={paymentCollection === "charge"}
        isFromDemoOnly={
          paymentCollection === "charge" &&
          !accountsOnFile.some((a) => a.id === selectedAccountOnFile)
        }
        customerAccount={(() => {
          if (paymentCollection !== "charge") return "";
          const source = [...chargeSourceAccountDemo, ...accountsOnFile].find(
            (a) => a.id === selectedAccountOnFile
          );
          if (!source) return "";
          const last4 = source.accountNumber.replace(/\s/g, "").slice(-4) || "----";
          return `${source.accountName} ****${last4}`;
        })()}
        receivingAccount={
          paymentCollection === "charge"
            ? (() => {
                const isFromUserAdded = accountsOnFile.some(
                  (a) => a.id === selectedAccountOnFile
                );
                return isFromUserAdded
                  ? "Account #1 ****3923"
                  : "Secondary Bank Account ****1010";
              })()
            : (() => {
                const acc = bankAccounts.find((a) => a.value === selectedAccount);
                if (!acc) return "";
                const last4 = acc.description?.match(/\d{4}$/)?.[0] ?? "****";
                return `${acc.label} ****${last4}`;
              })()
        }
      />
      <PaymentRequestSubmittedModal
        open={isPaymentRequestSubmittedOpen}
        onClose={() => setIsPaymentRequestSubmittedOpen(false)}
        onDone={handlePaymentRequestDone}
      />
    </Box>
  );
};

export default InitiatePaymentRequestPage;
