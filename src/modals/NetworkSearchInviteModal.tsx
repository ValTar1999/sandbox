import React, { useState, useMemo, useCallback } from "react";
import clsx from "clsx";
import LayoutModal from "../components/common/modal/LayoutModal";
import WrapModal from "../components/common/modal/WrapModal";
import Modal from "../components/common/modal/Modal";
import Button from "../components/common/base/Button";
import Input from "../components/common/base/Input";
import Icon from "../components/common/base/Icon";
import Toggle from "../components/common/base/Toggle";
import WrapSelect from "../components/common/base/WrapSelect";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/common/base/Tooltip";

export type ModalStage =
  | "search"
  | "searchResults"
  | "advancedSearch"
  | "advancedNoMatches"
  | "invite"
  | "linkRequest"
  | "rejectRequest"
  | "unlinkVendor"
  | "success";

interface SearchResult {
  id: string;
  companyName: string;
  companyId: string;
  email: string;
  phone: string;
  address: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    companyName: "Great Kahuna Burger Ltd.",
    companyId: "A3RDASF-345GRTE",
    email: "hobby@mymail.com",
    phone: "+300-56-432-50392",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 854...",
  },
  {
    id: "2",
    companyName: "Big Kahuna Burger Ltd.",
    companyId: "A3RDASF-345GRTE",
    email: "hobby@mymail.com",
    phone: "+300-56-432-50392",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 854...",
  },
];

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
];

interface NetworkSearchInviteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (result: SearchResult) => void;
  onInviteSent?: (email: string, phone: string, description: string) => void;
  onUnlink?: () => void;
  initialStage?: ModalStage;
  modalType?:
    | "inviteToNetwork"
    | "resendInvitation"
    | "sendLinkRequest"
    | "resendLinkRequest"
    | "deleteLink"
    | "rejectRequest";
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip trigger="hover" placement="bottom-start">
    <TooltipTrigger as="span" className="inline-flex cursor-help">
      <Icon icon="information-circle" className="w-5 h-5 text-gray-500" />
    </TooltipTrigger>
    <TooltipContent className="bg-white text-gray-900 shadow-lg border border-gray-200 max-w-[344px] gap-3 p-4 flex items-start">
      <Icon icon="information-circle" className="w-5 h-5 text-blue-400" />
      <div className="flex flex-col gap-1 text-sm leading-5">
        <div className="font-medium">Search in Network</div>
        <div className="text-gray-500">{text}</div>
      </div>
    </TooltipContent>
  </Tooltip>
);

const ResultCard: React.FC<{
  result: SearchResult;
  selected: boolean;
  onClick: () => void;
}> = ({ result, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "w-full text-left rounded-lg border py-4 px-6 cursor-pointer bg-white transition-all duration-200",
      selected
        ? "border-blue-500 bg-blue-50/30"
        : "border-gray-300 hover:border-gray-500"
    )}
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="text-base leading-7 font-medium text-gray-900">
        {result.companyName}
      </span>
      <span className="text-sm leading-5 text-gray-500">{result.companyId}</span>
    </div>
    <div className="flex items-center gap-6 text-sm leading-5 text-gray-500">
      <span className="flex items-center gap-1">
        <Icon icon="mail" className="w-5 h-5 text-blue-600" />
        {result.email}
      </span>
      <span className="flex items-center gap-1">
        <Icon icon="phone" className="w-5 h-5 text-blue-600" />
        {result.phone}
      </span>
      <span className="flex items-center gap-1 truncate">
        <Icon icon="office-building" className="w-5 h-5 text-blue-600" />
        {result.address}
      </span>
    </div>
  </button>
);

const NetworkSearchInviteModal: React.FC<NetworkSearchInviteModalProps> = ({
  open,
  onClose,
  onConfirm,
  onInviteSent,
  onUnlink,
  initialStage,
  modalType,
}) => {
  const [stage, setStage] = useState<ModalStage>(initialStage ?? "search");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const [advancedForm, setAdvancedForm] = useState({
    businessName: "",
    addressLine: "",
    email: "",
    city: "",
    phone: "",
    country: "",
    taxId: "",
    zipCode: "",
    state: "",
  });

  const [inviteForm, setInviteForm] = useState({
    email: "",
    phone: "",
    description:
      "Please join our electronic payments network on Mastercard BPS. Once we are connected, our electronic payments to you can flow faster and easier.",
  });

  const resetState = useCallback((stageOverride?: ModalStage) => {
    setStage(stageOverride ?? "search");
    setAdvancedMode(false);
    setSearchQuery("");
    setSelectedResult(null);
    setAdvancedForm({
      businessName: "",
      addressLine: "",
      email: "",
      city: "",
      phone: "",
      country: "",
      taxId: "",
      zipCode: "",
      state: "",
    });
    setInviteForm({
      email: "",
      phone: "",
      description:
        "Please join our electronic payments network on Mastercard BPS. Once we are connected, our electronic payments to you can flow faster and easier.",
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    resetState(initialStage);
  }, [open, initialStage, resetState]);

  const isProfileConfirmed =
    modalType === "resendInvitation" ||
    modalType === "sendLinkRequest" ||
    modalType === "resendLinkRequest";

  const isRejectSuccess = modalType === "rejectRequest";

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_RESULTS.filter(
      (r) =>
        r.companyName.toLowerCase().includes(q) ||
        r.companyId.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q)
    );
  }, [searchQuery]);

  const handleSimpleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (value.trim()) {
        setSelectedResult(null);
        setStage("searchResults");
      } else {
        setStage("search");
      }
    },
    []
  );

  const handleAdvancedSearch = useCallback(() => {
    setStage("advancedNoMatches");
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedResult) {
      onConfirm?.(selectedResult);
      handleClose();
    }
  }, [selectedResult, onConfirm, handleClose]);

  const handleSendInvite = useCallback(() => {
    onInviteSent?.(inviteForm.email, inviteForm.phone, inviteForm.description);
    setStage("success");
  }, [inviteForm, onInviteSent]);

  const handleSendLinkRequest = useCallback(() => {
    setStage("success");
  }, []);

  const handleGoBack = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleSwitchToInvite = useCallback(() => {
    setStage("invite");
  }, []);

  const handleSwitchToSearch = useCallback(() => {
    setStage(advancedMode ? "advancedSearch" : "search");
    setSearchQuery("");
    setSelectedResult(null);
  }, [advancedMode]);

  const handleToggleAdvanced = useCallback(
    (checked: boolean) => {
      setAdvancedMode(checked);
      setSelectedResult(null);
      if (checked) {
        setStage("advancedSearch");
        setSearchQuery("");
      } else {
        setStage("search");
      }
    },
    []
  );

  const handleModifySearch = useCallback(() => {
    setStage("advancedSearch");
  }, []);

  const updateAdvancedField = useCallback(
    <K extends keyof typeof advancedForm>(field: K, value: string) => {
      setAdvancedForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateInviteField = useCallback(
    <K extends keyof typeof inviteForm>(field: K, value: string) => {
      setInviteForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  if (!open) return null;

  if (stage === "success") {
    return (
      <LayoutModal>
        <WrapModal
          className="w-[600px] max-w-full"
          onClose={handleClose}
        >
          <div className="flex flex-col items-center px-6 pb-6">
            {isRejectSuccess ? (
              <>
                <Icon icon="x" className="h-11 w-11 text-red-500" />
                <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                  Request Rejected
                </h2>
                <p className="text-sm leading-5 text-gray-500 text-center mb-6">
                  Your link request has been rejected.
                </p>
              </>
            ) : isProfileConfirmed ? (
              <>
                <Icon
                  icon="check-circle"
                  className="h-11 w-11 text-green-500"
                />
                <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                  Profile Confirmed
                </h2>
                <p className="text-sm leading-5 text-gray-500 text-center mb-6">
                  The profile of your vendor has been confirmed. Now you can
                  nudge them to initiate a link request.
                </p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                >
                  <path
                    opacity="0.3"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.33333 29.3333H9.16667C10.1792 29.3333 11 30.1541 11 31.1667C11 32.1792 10.1792 33 9.16667 33H7.33333C6.32081 33 5.5 32.1792 5.5 31.1667C5.5 30.1541 6.32081 29.3333 7.33333 29.3333ZM1.83333 20.1667H9.16667C10.1792 20.1667 11 20.9875 11 22C11 23.0125 10.1792 23.8333 9.16667 23.8333H1.83333C0.820811 23.8333 0 23.0125 0 22C0 20.9875 0.820811 20.1667 1.83333 20.1667ZM5.5 11H9.16667C10.1792 11 11 11.8208 11 12.8333C11 13.8459 10.1792 14.6667 9.16667 14.6667H5.5C4.48748 14.6667 3.66667 13.8459 3.66667 12.8333C3.66667 11.8208 4.48748 11 5.5 11Z"
                    fill="#2563EB"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.3327 11H40.3327C42.3577 11 43.9993 12.6416 43.9993 14.6667V29.3333C43.9993 31.3584 42.3577 33 40.3327 33H18.3327C16.3076 33 14.666 31.3584 14.666 29.3333V14.6667C14.666 12.6416 16.3076 11 18.3327 11ZM38.6551 14.7984L29.3327 19.6507L20.0103 14.7984C19.457 14.5103 18.7669 14.7105 18.4689 15.2454C18.171 15.7802 18.378 16.4473 18.9313 16.7353L28.7932 21.8685C29.13 22.0438 29.5354 22.0438 29.8722 21.8685L39.734 16.7353C40.2874 16.4473 40.4944 15.7802 40.1965 15.2454C39.8985 14.7105 39.2084 14.5103 38.6551 14.7984Z"
                    fill="#2563EB"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-8">
                  Invitation Email Sent
                </h2>
                <p className="text-sm leading-5 text-gray-500 text-center mb-6">
                  Your invitation to join your company on the network was
                  successfully sent. The invitation includes a link and instructions
                  on how to join your network.
                </p>
              </>
            )}
            <Button size="xl" className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        </WrapModal>
      </LayoutModal>
    );
  }

  if (stage === "linkRequest") {
    return (
      <LayoutModal>
        <WrapModal className="w-128 max-w-full" onClose={handleClose}>
          <div className="flex flex-col items-center px-6 pb-6 space-y-6">
            <Icon icon="check-circle" className="h-11 w-11 text-green-500" />
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Send Link Request
              </h2>
              <p className="text-sm leading-5 text-gray-500">
                By accepting this request, you and your vendor will be linked
                enabling faster transactions and supply chain financing
                (if available).
              </p>
            </div>
            <div className="w-full flex flex-col gap-4">
              <Button size="xl" className="w-full" onClick={handleSendLinkRequest}>
                Send
              </Button>
              <Button variant="secondary" size="xl" className="w-full" onClick={handleGoBack}>
                Go back
              </Button>
            </div>
          </div>
        </WrapModal>
      </LayoutModal>
    );
  }

  if (stage === "rejectRequest") {
    return (
      <LayoutModal>
        <WrapModal className="w-128 max-w-full" onClose={handleClose}>
          <div className="flex flex-col items-center px-6 pb-6 space-y-6">
            <Icon icon="x" className="h-11 w-11 text-red-500" />
            <div className="text-center space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Reject Link Request?
              </h2>
              <p className="text-sm leading-5 text-gray-500">
                By rejecting this request, the link will be unsuccessful. For
                re-initiation, you will need to send a link request.
              </p>
            </div>
            <div className="w-full flex flex-col gap-4">
              <Button
                variant="primaryDistructive"
                size="xl"
                className="w-full"
                onClick={() => setStage("success")}
              >
                Reject
              </Button>
              <Button
                variant="secondary"
                size="xl"
                className="w-full"
                onClick={handleGoBack}
              >
                Go back
              </Button>
            </div>
          </div>
        </WrapModal>
      </LayoutModal>
    );
  }

  if (stage === "unlinkVendor") {
    return (
      <LayoutModal>
        <Modal
          className="w-128"
          titleCenter={true}
          title="Unlink Vendor"
          description="Disconnect from your vendor's network on Mastercard Track BPS."
          icon={<Icon icon="disconnect" className="h-11 w-11 text-red-500" />}
          onClose={handleClose}
        >
          <div className="flex flex-col gap-3 w-full -mt-2">
            <Button
              variant="primaryDistructive"
              size="xl"
              className="w-full"
              onClick={() => {
                onUnlink?.();
                handleClose();
              }}
            >
              Unlink
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="w-full"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </LayoutModal>
    );
  }

  if (stage === "invite") {
    return (
      <LayoutModal>
        <WrapModal
          className="w-[800px] max-w-full"
          onClose={handleClose}
          header={<div>Network Search and Invite</div>}
          footer={
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="lg" onClick={handleClose}>
                Cancel
              </Button>
              <Button size="lg" onClick={handleSendInvite}>
                Confirm
              </Button>
            </div>
          }
        >
          <div className="">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <span className="text-base font-medium text-gray-900">
                Invite to network
              </span>
              <Button
                variant="linkPrimary"
                size="sm"
                icon="search"
                iconDirection="left"
                iconClass="w-4 h-4"
                onClick={handleSwitchToSearch}
                className="gap-1"
              >
                Search in Network
              </Button>
            </div>
            
            <div className="h-full min-h-[430px] px-6 pt-4 pb-6 space-y-4">
              <div className="bg-gray-50 rounded-md p-4 text-sm leading-5 text-center text-gray-600">
                We will send an invitation to join your network on Mastercard Track
                BPS. The email invitation will provide your customer with the
                instructions they need to join network.
              </div>
              <div className="grid grid-cols-2 gap-9">
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    placeholder="example@mail.you"
                    icon="mail"
                    value={inviteForm.email}
                    onChange={(e) => updateInviteField("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    placeholder="000-00-000-00000"
                    icon="phone"
                    value={inviteForm.phone}
                    onChange={(e) => updateInviteField("phone", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm leading-5 font-medium text-gray-700">
                    Description
                  </label>
                  <span className="text-sm leading-5 text-gray-800 font-medium">Optional</span>
                </div>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main resize-y transition duration-300"
                  value={inviteForm.description}
                  onChange={(e) =>
                    updateInviteField("description", e.target.value)
                  }
                />
              </div>
            </div>

          </div>
        </WrapModal>
      </LayoutModal>
    );
  }

  const DEFAULT_ADVANCED_SEARCH_SUMMARY =
    "Big Kahuna Burger Ltd., bigkahuna@burger.com, +300-21-12345, 322124DF21, United States";

  const countryLabel = countryOptions.find(
    (o) => o.value === advancedForm.country
  )?.label;

  const advancedSearchSummaryParts = [
    advancedForm.businessName,
    advancedForm.email,
    advancedForm.phone,
    advancedForm.taxId,
    countryLabel,
  ].filter(Boolean);

  const advancedSearchSummary =
    advancedSearchSummaryParts.length > 0
      ? advancedSearchSummaryParts.join(", ")
      : DEFAULT_ADVANCED_SEARCH_SUMMARY;

  return (
    <LayoutModal>
      <WrapModal
        className="w-[800px] max-w-full"
        onClose={handleClose}
        header={<div>Network Search and Invite</div>}
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedResult}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div>
          <div
            className={clsx(
              "px-6 space-y-6 border-b border-gray-200",
              advancedMode && stage !== "advancedNoMatches" ? "border-b-0 pb-6 pt-5" : 'py-5'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-gray-900">
                  Search in Network
                </span>
                <InfoTooltip text="Quickly determine whether a customer is part of the Mastercard Track BPS network." />
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-md">                
                  <Toggle
                    checked={advancedMode}
                    onChange={handleToggleAdvanced}
                    size="md"
                  />
                  <span className="text-sm leading-5 text-gray-700">Advanced search</span>
                </div>
              </div>
              <Button
                variant="linkPrimary"
                size="sm"
                icon="mail"
                iconDirection="left"
                iconClass="w-4 h-4"
                onClick={handleSwitchToInvite}
                className="gap-1"
              >
                Invite via Email
              </Button>
            </div>
            {!advancedMode && stage !== "advancedNoMatches" && (
              <Input
                placeholder="Search by business name, tax ID, email or phone number"
                icon="search"
                iconDirection="right"
                value={searchQuery}
                onChange={(e) => handleSimpleSearch(e.target.value)}
              />
            )}
            {stage === "advancedNoMatches" && (
              <div>
                <div className="text-sm leading-5 font-medium text-gray-700 mb-1">
                  Search Details
                </div>
                <div className="flex items-center justify-between gap-3 border border-gray-200 rounded-md px-3 py-2.5">
                  <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">
                    {advancedSearchSummary || "—"}
                  </span>
                  <button
                    type="button"
                    onClick={handleModifySearch}
                    className="text-sm font-medium text-blue-600 whitespace-nowrap ml-3 cursor-pointer hover:text-blue-700"
                  >
                    Modify Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {!advancedMode && stage !== "advancedNoMatches" && (
            <div className="px-6 pb-6 pt-4 h-full min-h-[368px]">
              {stage === "searchResults" && searchResults.length > 0 && (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      selected={selectedResult?.id === result.id}
                      onClick={() => setSelectedResult(result)}
                    />
                  ))}

                  <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-4 flex items-center justify-center gap-1">
                    <span className="text-sm text-gray-500 leading-5">No match?</span>
                    <button
                      type="button"
                      onClick={handleSwitchToInvite}
                      className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700"
                    >
                      Invite via Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {advancedMode && stage === "advancedSearch" && (
            <div className="px-6 pb-6 h-full min-h-[444px] grid grid-cols-2 gap-6">

              <div className="grid gap-4 content-start">
                <div>
                  <label className="flex items-center gap-1 text-sm leading-5 font-medium text-gray-700 mb-1">
                    Business Name
                    <InfoTooltip text="Enter the legal business name of the company." />
                  </label>
                  <Input
                    placeholder="Business Name"
                    value={advancedForm.businessName}
                    onChange={(e) =>
                      updateAdvancedField("businessName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm leading-5 font-medium text-gray-700 mb-1">
                    Email
                    <InfoTooltip text="Email address associated with the business." />
                  </label>
                  <Input
                    placeholder="example@gmail.com"
                    icon="mail"
                    value={advancedForm.email}
                    onChange={(e) =>
                      updateAdvancedField("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm leading-5 font-medium text-gray-700 mb-1">
                    Phone Number
                    <InfoTooltip text="Phone number associated with the business." />
                  </label>
                  <Input
                    placeholder="000-00-00000"
                    icon="phone"
                    value={advancedForm.phone}
                    onChange={(e) =>
                      updateAdvancedField("phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Tax ID
                  </label>
                  <Input
                    placeholder="000-00-00000"
                    value={advancedForm.taxId}
                    onChange={(e) =>
                      updateAdvancedField("taxId", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 content-start">
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Address Line
                  </label>
                  <Input
                    placeholder=""
                    value={advancedForm.addressLine}
                    onChange={(e) =>
                      updateAdvancedField("addressLine", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    placeholder=""
                    value={advancedForm.city}
                    onChange={(e) =>
                      updateAdvancedField("city", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <WrapSelect
                    placeholder="Select country"
                    options={countryOptions}
                    selectedValue={advancedForm.country}
                    onSelect={(v) => updateAdvancedField("country", v)}
                    hideLabel
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <Input
                      placeholder=""
                      value={advancedForm.zipCode}
                      onChange={(e) =>
                        updateAdvancedField("zipCode", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Input
                      placeholder=""
                      value={advancedForm.state}
                      onChange={(e) =>
                        updateAdvancedField("state", e.target.value)
                      }
                    />
                  </div>
                </div>
                
                <Button
                  size="lg"
                  variant="primaryTransparent"
                  icon="search"
                  iconDirection="left"
                  className="w-full"
                  onClick={handleAdvancedSearch}
                >
                  Search
                </Button>
              </div>

            </div>
          )}

          {stage === "advancedNoMatches" && (
            <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[340px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="98" height="81" viewBox="0 0 98 81" fill="none">
                <path d="M48.8947 80.3952C68.7684 80.3952 84.8793 77.38 84.8793 73.6605C84.8793 69.941 68.7684 66.9258 48.8947 66.9258C29.021 66.9258 12.9102 69.941 12.9102 73.6605C12.9102 77.38 29.021 80.3952 48.8947 80.3952Z" fill="#F5F5F7" fill-opacity="0.8"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M77.6801 53.8759L64.9815 38.2219C64.3721 37.4851 63.4815 37.0391 62.5436 37.0391H35.2409C34.3035 37.0391 33.4129 37.4851 32.8036 38.2219L20.1055 53.8759V62.0539H77.6807V53.8759H77.6801Z" fill="#AEB8C2"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M30.8653 16.8359H66.922C67.4851 16.8359 68.0251 17.06 68.4232 17.4588C68.8214 17.8576 69.0451 18.3985 69.0451 18.9625V68.5871C69.0451 69.1511 68.8214 69.692 68.4232 70.0908C68.0251 70.4896 67.4851 70.7137 66.922 70.7137H30.8653C30.3022 70.7137 29.7622 70.4896 29.364 70.0908C28.9659 69.692 28.7422 69.1511 28.7422 68.5871V18.9625C28.7422 18.3985 28.9659 17.8576 29.364 17.4588C29.7622 17.06 30.3022 16.8359 30.8653 16.8359V16.8359Z" fill="#F5F5F7"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M35.5609 22.1289H62.2252C62.5067 22.1289 62.7767 22.2409 62.9758 22.4403C63.1749 22.6397 63.2867 22.9102 63.2867 23.1922V36.4601C63.2867 36.7421 63.1749 37.0126 62.9758 37.212C62.7767 37.4114 62.5067 37.5234 62.2252 37.5234H35.5609C35.2794 37.5234 35.0094 37.4114 34.8103 37.212C34.6112 37.0126 34.4994 36.7421 34.4994 36.4601V23.1922C34.4994 22.9102 34.6112 22.6397 34.8103 22.4403C35.0094 22.2409 35.2794 22.1289 35.5609 22.1289ZM35.7 43.2953H62.0861C62.4045 43.2953 62.7099 43.422 62.9351 43.6475C63.1602 43.873 63.2867 44.1789 63.2867 44.4979C63.2867 44.8168 63.1602 45.1227 62.9351 45.3482C62.7099 45.5737 62.4045 45.7004 62.0861 45.7004H35.7C35.3816 45.7004 35.0762 45.5737 34.851 45.3482C34.6259 45.1227 34.4994 44.8168 34.4994 44.4979C34.4994 44.1789 34.6259 43.873 34.851 43.6475C35.0762 43.422 35.3816 43.2953 35.7 43.2953ZM35.7 49.5489H62.0861C62.4046 49.5489 62.7101 49.6756 62.9353 49.9012C63.1605 50.1268 63.287 50.4327 63.287 50.7517C63.287 51.0707 63.1605 51.3767 62.9353 51.6022C62.7101 51.8278 62.4046 51.9545 62.0861 51.9545H35.7C35.3815 51.9545 35.0761 51.8278 34.8509 51.6022C34.6257 51.3767 34.4991 51.0707 34.4991 50.7517C34.4991 50.4327 34.6257 50.1268 34.8509 49.9012C35.0761 49.6756 35.3815 49.5489 35.7 49.5489ZM77.5634 72.676C77.152 74.3086 75.7073 75.5255 73.9886 75.5255H23.7975C22.0789 75.5255 20.6341 74.3081 20.2233 72.676C20.1449 72.3648 20.1054 72.0452 20.1055 71.7243V53.879H34.0742C35.6172 53.879 36.8608 55.1805 36.8608 56.7605V56.7817C36.8608 58.3612 38.1187 59.6366 39.6617 59.6366H58.1245C59.6674 59.6366 60.9253 58.3495 60.9253 56.7695V56.7631C60.9253 55.1831 62.1689 53.8785 63.7119 53.8785H77.6806V71.7249C77.6806 72.0529 77.6398 72.3713 77.5634 72.676Z" fill="#DCE0E6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M79.3208 17.6991L75.6956 19.1079C75.6025 19.1442 75.501 19.1534 75.4029 19.1345C75.3048 19.1156 75.214 19.0693 75.141 19.001C75.0679 18.9327 75.0156 18.8451 74.9901 18.7483C74.9646 18.6516 74.9668 18.5496 74.9966 18.454L76.0247 15.1542C74.6505 13.589 73.8438 11.6805 73.8438 9.62095C73.8438 4.30728 79.2141 0 85.8391 0C92.4626 0 97.8334 4.30728 97.8334 9.62095C97.8334 14.9346 92.4631 19.2419 85.8386 19.2419C83.4353 19.2419 81.1976 18.6752 79.3208 17.6991Z" fill="#DCE0E6"/>
                <path d="M90.5629 11.3603C91.3981 11.3603 92.0751 10.6903 92.0751 9.86373C92.0751 9.03721 91.3981 8.36719 90.5629 8.36719C89.7278 8.36719 89.0508 9.03721 89.0508 9.86373C89.0508 10.6903 89.7278 11.3603 90.5629 11.3603Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M82.6259 11.1735H79.6016L81.1397 8.55469L82.6259 11.1735ZM84.516 8.55469H87.1618V11.1735H84.516V8.55469Z" fill="white"/>
              </svg>
              <h3 className="text-2xl leading-8 font-semibold text-gray-900">
                No matches found
              </h3>
              <p className="text-sm leading-5 text-gray-500 text-center">
                Looks like there were no matches for your search.
                <br />
                Please modify your search
              </p>
              <span className="text-sm leading-5 text-gray-400">or</span>
              <div className="border-2 border-dashed border-gray-300 rounded-md px-6 py-4">
                <button
                  type="button"
                  onClick={handleSwitchToInvite}
                  className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700"
                >
                  Invite via Email
                </button>
              </div>
            </div>
          )}
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default NetworkSearchInviteModal;
