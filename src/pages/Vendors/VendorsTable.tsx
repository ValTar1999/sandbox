import React, { useCallback, useState } from "react";
import clsx from "clsx";
import Icon from "../../components/common/base/Icon";
import Button from "../../components/common/base/Button";
import Menu, { useMenuContext } from "../../components/common/base/Menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/common/base/Tooltip";
import MastercardFlag from "../../assets/image/mastercard-flag.svg";
import Badge from "../../components/common/base/Badge";
import {
  Vendor,
  PaymentNetworkStatus,
} from "./data";
import {
  TH_CLASS,
  TH_TEXT_CLASS,
  TD_CLASS,
  FLEX_START,
} from "../../constants/tableStyles";
import SmartDisburseIcon from "../../assets/image/SMART-Disburse.svg";
import ACHGradientIcon from "../../assets/image/ACH-Gradient.svg";
import SMARTExchangeIcon from "../../assets/image/SMART Exchange.svg";

export type NetworkAction = {
  label: string;
  icon: string;
  iconColor?: string;
  labelColor?: string;
  nextStatus?: PaymentNetworkStatus;
  actionType?: 'changeStatus' | 'modal';
  modalType?: string;
};

interface VendorsTableProps {
  vendors: Vendor[];
  onPaymentNetworkChange?: (vendor: Vendor, status: PaymentNetworkStatus) => void;
  onNetworkAction?: (action: NetworkAction, vendor: Vendor) => void;
}

const PAYMENT_NETWORK_CONFIG: Record<
  PaymentNetworkStatus,
  {
    label: string;
    icon?: string;
    iconImageSrc?: string;
    IconColor?: string;
    labelColor?: string;
    actions: NetworkAction[];
  }
> = {
  notInNetwork: {
    label: "Not in Network",
    icon: "x",
    IconColor: "text-gray-400",
    actions: [
      {
        label: "Invite to network",
        icon: "plus-circle",
        iconColor: "text-gray-500",
        actionType: "modal",
        modalType: "inviteToNetwork",
      },
    ],
  },
  invitationSent: {
    label: "Invitation sent",
    icon: "in-progress",
    IconColor: "text-gray-400",
    actions: [
      {
        label: "Re-send Invitation",
        icon: "refresh",
        iconColor: "text-gray-500",
        actionType: "modal",
        modalType: "resendInvitation",
      },
    ],
  },
  linkRequestPending: {
    label: "Link Request Pending",
    labelColor: "text-blue-800",
    icon: "in-progress",
    IconColor: "text-blue-400",
    actions: [
      {
        label: "Re-send Link Request",
        icon: "refresh",
        iconColor: "text-gray-500",
        actionType: "modal",
        modalType: "resendLinkRequest",
      },
    ],
  },
  inNetwork: {
    label: "In Network",
    labelColor: "text-blue-800",
    icon: "check",
    IconColor: "text-blue-400",
    actions: [
      {
        label: "Send Link Request",
        icon: "link",
        iconColor: "text-gray-500",
        actionType: "modal",
        modalType: "sendLinkRequest",
      },
    ],
  },
  requestReceived: {
    label: "Request Received",
    labelColor: "text-yellow-800",
    icon: "inbox-in",
    IconColor: "text-yellow-400",
    actions: [
      {
        label: "Send Link Request",
        icon: "check",
        iconColor: "text-green-500",
        labelColor: "text-green-600",
        actionType: "modal",
        modalType: "sendLinkRequest",
      },
      {
        label: "Reject",
        icon: "x",
        iconColor: "text-red-500",
        labelColor: "text-red-600",
        actionType: "modal",
        modalType: "rejectRequest",
      },
    ],
  },
  rejected: {
    label: "Rejected",
    labelColor: "text-red-800",
    icon: "x",
    IconColor: "text-red-400",
    actions: [],
  },
  track: {
    label: "Track",
    iconImageSrc: MastercardFlag,
    actions: [
      {
        label: "View Payment Preferences",
        icon: "adjustments",
        iconColor: "text-gray-500",
        actionType: "modal",
        modalType: "viewPaymentPreferences",
      },
      {
        label: "Delete Link",
        icon: "disconnect",
        iconColor: "text-red-500",
        labelColor: "text-red-600",
        actionType: "modal",
        modalType: "deleteLink",
      },
    ],
  },
};

const PAYMENT_METHOD_ICONS: Record<string, { icon: string; label: string }> = {
  card: { icon: SmartDisburseIcon, label: "SMART Disburse" },
  bank: { icon: ACHGradientIcon, label: "ACH" },
  cash: { icon: SMARTExchangeIcon, label: "SMART Exchange" },
};

const ThWithInfo: React.FC<{
  children: React.ReactNode;
  tooltipContent?: React.ReactNode;
}> = ({ children, tooltipContent }) => (
  <div className="flex items-center gap-1">
    <span className={TH_TEXT_CLASS}>{children}</span>
    {tooltipContent ? (
      <Tooltip trigger="hover" placement="top">
        <TooltipTrigger as="span" className="inline-flex cursor-help">
          <Icon icon="information-circle" className="w-4 h-4 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 w-[320px] p-6 rounded-lg shadow-dropdown">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    ) : (
      <Icon icon="information-circle" className="w-4 h-4 text-gray-400" />
    )}
  </div>
);

const NetworkActionButton: React.FC<{
  action: NetworkAction;
  vendor: Vendor;
  onSelect: (vendor: Vendor, status: PaymentNetworkStatus) => void;
  onActionClick?: (action: NetworkAction, vendor: Vendor) => void;
}> = ({ action, vendor, onSelect, onActionClick }) => {
  const { setOpen } = useMenuContext();

  const handleClick = () => {
    setOpen(false);
    if (action.actionType === 'modal') {
      onActionClick?.(action, vendor);
    } else {
      onSelect(vendor, action.nextStatus ?? vendor.paymentNetworkStatus);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'w-full flex items-center gap-3 px-3 py-2 text-sm leading-5 text-left transition-colors duration-300 hover:bg-gray-50 cursor-pointer',
        action.labelColor ? action.labelColor : "text-gray-800"
      )}
    >
      <Icon icon={action.icon} className={`w-5 h-5 ${action.iconColor ?? "text-gray-500"}`} />
      <span className="flex-1">{action.label}</span>
    </button>
  );
};

const PaymentNetworkSelect: React.FC<{
  vendor: Vendor;
  onSelect: (vendor: Vendor, status: PaymentNetworkStatus) => void;
  onActionClick?: (action: NetworkAction, vendor: Vendor) => void;
}> = ({ vendor, onSelect, onActionClick }) => {
  const config = PAYMENT_NETWORK_CONFIG[vendor.paymentNetworkStatus];
  const isRequestReceived = vendor.paymentNetworkStatus === "requestReceived";

  return (
    <Menu.Root placement="bottom-end">
      <div className={clsx("inline-flex items-center", isRequestReceived ? "ring-4 ring-yellow-400/20 rounded-sm" : "")}>
        <div
          className={clsx(
            "flex items-center gap-0.5 py-1.5 pl-1.5 pr-2.5 border-l border-y bg-white rounded-l-sm",
            isRequestReceived ? "border-yellow-300" : "border-gray-300"
          )}
        >
          {config.icon && (
            <Icon icon={config.icon} className={`w-3.5 h-3.5 ${config.IconColor}`} />
          )}        
          {config.iconImageSrc && (
            <img src={config.iconImageSrc} alt={config.label} className="w-3.5 h-3.5" />
          )}
          <div className={`text-xs leading-4 font-medium text-nowrap ${config.labelColor ?? "text-gray-800"}`}>{config.label}</div>
        </div>
        <Menu.Trigger as="button" className={clsx("cursor-pointer p-1.5 border bg-white rounded-r-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-300", isRequestReceived ? "border-yellow-300" : "border-gray-300")}>
          <Icon icon="chevron-down" className={clsx("w-4 h-4", isRequestReceived ? "text-yellow-500" : "text-gray-500")} />
        </Menu.Trigger>
      </div>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="z-50 w-fit bg-white rounded-md shadow-lg overflow-hidden">
            <div className="">
              {config.actions.map((action) => (
                <NetworkActionButton
                  key={`${action.actionType ?? 'unknown'}-${action.modalType ?? action.label}`}
                  action={action}
                  vendor={vendor}
                  onSelect={onSelect}
                  onActionClick={onActionClick}
                />
              ))}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const VendorsTable: React.FC<VendorsTableProps> = ({
  vendors,
  onPaymentNetworkChange,
  onNetworkAction,
}) => {
  const [sortField, setSortField] = useState<"companyName" | null>("companyName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handlePaymentNetworkSelect = useCallback(
    (vendor: Vendor, status: PaymentNetworkStatus) => {
      onPaymentNetworkChange?.(vendor, status);
    },
    [onPaymentNetworkChange]
  );

  const handleActionClick = useCallback(
    (action: NetworkAction, vendor: Vendor) => {
      onNetworkAction?.(action, vendor);
    },
    [onNetworkAction]
  );

  const handleSortCompany = useCallback(() => {
    setSortField((prev) => (prev === "companyName" ? "companyName" : "companyName"));
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const sortedVendors = React.useMemo(() => {
    if (!sortField) return vendors;
    return [...vendors].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [vendors, sortField, sortDir]);

  return (
    <div className="overflow-x-auto w-full px-6">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <button
                  onClick={handleSortCompany}
                  className="flex items-center gap-1"
                >
                  <div className={TH_TEXT_CLASS}>COMPANY NAME</div>
                  <Icon icon="selector" className="text-gray-400 w-4 h-4" />
                </button>
              </div>
            </th>
            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}>COMPANY ID</span>
              </div>
            </th>
            <th
              className={clsx(
                TH_CLASS,
                "max-w-[156px] min-w-[156px] w-[156px]"
              )}
            >
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}># OF OPEN PAYABLES</span>
              </div>
            </th>
            <th className={clsx(
              TH_CLASS,
              "max-w-[283px] min-w-[283px] w-[283px]"
            )}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}>PAYMENT TERMS</span>
              </div>
            </th>
            <th className={clsx(
              TH_CLASS,
              "max-w-[206px] min-w-[206px] w-[206px]"
            )}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}>METHOD OF PAYMENT</span>
              </div>
            </th>
            <th className={clsx(
              TH_CLASS,
              "max-w-[220px] min-w-[220px] w-[220px]"
            )}>
              <div className="flex items-center gap-1">
                <ThWithInfo
                  tooltipContent={
                    <div className="flex flex-col gap-3">
                      <div className="text-base font-bold leading-5 text-white">
                        Payment Network
                      </div>
                      <div className="text-sm leading-5 text-gray-400">
                        An electronic payment network digitally connects buyers and
                        suppliers to facilitate payment transactions.
                      </div>
                    </div>
                  }
                >
                  PAYMENT NETWORK
                </ThWithInfo>
                <Button icon="filter" size="xs" variant="linkSecondary" />
              </div>
            </th>
            <th className={clsx(
              TH_CLASS,
              "max-w-40 min-w-40 w-40"
            )}>
              <div className="flex items-center gap-1">
                <ThWithInfo
                  tooltipContent={
                    <div className="flex flex-col gap-3">
                      <div className="text-base font-bold leading-5 text-white">
                        Early Payment Option
                      </div>
                      <div className="text-sm leading-5 text-gray-400">
                        You can offer this vendor an early payment option, which means
                        you can pay their invoice(s) before the due date and receive a
                        discount or other incentive.
                      </div>
                    </div>
                  }
                >
                  <div className="text-end">
                    EARLY PAYMENT OPTION
                  </div>
                </ThWithInfo>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVendors.map((vendor) => (
            <tr
              key={vendor.id}
              className="transition-colors duration-200 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
            >
              <td className={TD_CLASS}>
                <div className="text-sm font-medium leading-5 text-gray-900 truncate max-w-2xs">
                  {vendor.companyName}
                </div>
              </td>
              <td className={TD_CLASS}>
                <div className="text-sm text-gray-500">{vendor.companyId}</div>
              </td>
              <td
                className={clsx(
                  TD_CLASS,
                  "max-w-[156px] min-w-[156px] w-[156px]"
                )}
              >
                <div className="text-sm text-gray-900">{vendor.openPayables}</div>
              </td>
              <td
                className={clsx(
                  TD_CLASS,
                  "max-w-[283px] min-w-[283px] w-[283px]"
                )}
              >
                <div className="text-sm text-gray-700">{vendor.paymentTerms}</div>
              </td>
              <td className={clsx(
                TD_CLASS,
                "max-w-[206px] min-w-[206px] w-[206px]"
              )}>
                <div className="flex items-center gap-2">
                  {vendor.paymentMethods.map((method) => {
                    const cfg = PAYMENT_METHOD_ICONS[method];
                    if (!cfg) return null;
                    return (
                      <Tooltip key={method} trigger="hover" placement="top">
                        <TooltipTrigger as="span" className="inline-flex cursor-default">
                          <img src={cfg.icon} alt={cfg.label} className="w-4.5 h-4.5" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-dropdown">
                          {cfg.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </td>
              <td className={clsx(
                TD_CLASS,
                "max-w-[220px] min-w-[220px] w-[220px]"
              )}>
                <div className="flex items-center justify-end">
                  <PaymentNetworkSelect
                    vendor={vendor}
                    onSelect={handlePaymentNetworkSelect}
                    onActionClick={handleActionClick}
                  />
                </div>
              </td>
              <td className={TD_CLASS}>
                <div className="flex items-center justify-end">
                  <Tooltip trigger="hover" placement="top-end">
                    <TooltipTrigger as="span" className="inline-flex cursor-default">
                      <Badge
                        color={vendor.earlyPaymentOption ? "green" : "gray"}
                        size="sm"
                        rounded
                      >
                        {vendor.earlyPaymentOption ? "Available" : "Not available"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 w-full max-w-[360px] text-gray-50 text-sm leading-5 font-medium px-2.5 py-2 rounded-lg shadow-dropdown">
                      {vendor.earlyPaymentOption ? (
                        <span>
                          You can offer this vendor an early payment option, which means you can pay their invoice(s) before the due date and receive a discount or other incentive.
                        </span>
                      ) : (
                        <div className="flex flex-col items-start">
                          <span>
                            The early payment option is not available.<br />However, you can activate this feature by contacting the vendor directly and requesting it.
                          </span>
                          <button
                            type="button"
                            className="font-medium group text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors duration-300"
                          >
                            Contact vendor <Icon icon="arrow-right" className="w-2.5 h-2.5 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                          </button>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorsTable;
