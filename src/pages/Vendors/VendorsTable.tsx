import React, { useCallback, useState } from "react";
import clsx from "clsx";
import Icon from "../../component/base/Icon";
import Button from "../../component/base/Button";
import Menu from "../../component/base/Menu";
import ButtonGroup from "../../component/base/ButtonGroup";
import MastercardFlag from "../../assets/image/mastercard-flag.svg";
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

interface VendorsTableProps {
  vendors: Vendor[];
  onPaymentNetworkChange?: (vendor: Vendor, status: PaymentNetworkStatus) => void;
}

type ButtonGroupVariant = React.ComponentProps<typeof ButtonGroup>["variant"];

const PAYMENT_NETWORK_CONFIG: Record<
  PaymentNetworkStatus,
  { label: string; icon: string; iconImageSrc?: string; variant: ButtonGroupVariant }
> = {
  notInNetwork: {
    label: "Not in Network",
    icon: "x",
    variant: "gray",
  },
  invitationSent: {
    label: "Invitation sent",
    icon: "in-progress",
    variant: "gray",
  },
  linkRequestPending: {
    label: "Link Request Pending",
    icon: "in-progress",
    variant: "blue",
  },
  inNetwork: {
    label: "In Network",
    icon: "check",
    variant: "blueFilled",
  },
  requestReceived: {
    label: "Request Received",
    icon: "lightning-bolt",
    variant: "yellow",
  },
  rejected: {
    label: "Rejected",
    icon: "x",
    variant: "red",
  },
  track: {
    label: "Track",
    icon: "credit-card",
    iconImageSrc: MastercardFlag,
    variant: "white",
  },
};

const PAYMENT_METHOD_ICONS: Record<string, { icon: string; colorClass: string }> = {
  card: { icon: "credit-card", colorClass: "text-blue-500" },
  bank: { icon: "library", colorClass: "text-green-600" },
  cash: { icon: "currency-dollar", colorClass: "text-yellow-600" },
};

const ThWithInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1">
    <span className={TH_TEXT_CLASS}>{children}</span>
    <Icon icon="information-circle" className="w-4 h-4 text-gray-400" />
  </div>
);

const PaymentNetworkSelect: React.FC<{
  vendor: Vendor;
  onSelect: (vendor: Vendor, status: PaymentNetworkStatus) => void;
}> = ({ vendor, onSelect }) => {
  const config = PAYMENT_NETWORK_CONFIG[vendor.paymentNetworkStatus];

  return (
    <Menu.Root placement="bottom-start">
      <Menu.Trigger as="button" className="p-0 border-0 bg-transparent cursor-pointer">
        <ButtonGroup
          label={config.label}
          icon={config.icon}
          iconImageSrc={config.iconImageSrc}
          variant={config.variant}
          size="md"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup className="z-50 min-w-[200px]">
            <Menu.Arrow className="fill-white text-gray-200" />
            <div className="p-2 space-y-0.5">
              {(Object.keys(PAYMENT_NETWORK_CONFIG) as PaymentNetworkStatus[]).map(
                (status) => {
                  const cfg = PAYMENT_NETWORK_CONFIG[status];
                  const isSelected = vendor.paymentNetworkStatus === status;
                  return (
                    <button
                      key={status}
                      onClick={() => onSelect(vendor, status)}
                      className={clsx(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left hover:bg-gray-50",
                        isSelected && "bg-blue-50"
                      )}
                    >
                      <Icon icon={cfg.icon} className="w-4 h-4 text-gray-500" />
                      {cfg.label}
                    </button>
                  );
                }
              )}
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
}) => {
  const [sortField, setSortField] = useState<"companyName" | null>("companyName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handlePaymentNetworkSelect = useCallback(
    (vendor: Vendor, status: PaymentNetworkStatus) => {
      onPaymentNetworkChange?.(vendor, status);
    },
    [onPaymentNetworkChange]
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
            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}># OF OPEN PAYABLES</span>
              </div>
            </th>
            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}>PAYMENT TERMS</span>
              </div>
            </th>
            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <span className={TH_TEXT_CLASS}>METHOD OF PAYMENT</span>
              </div>
            </th>
            <th className={TH_CLASS}>
              <div className="flex items-center gap-1">
                <ThWithInfo>PAYMENT NETWORK</ThWithInfo>
                <Button icon="filter" size="xs" variant="linkSecondary" />
              </div>
            </th>
            <th className={TH_CLASS}>
              <div className="flex items-center gap-1">
                <ThWithInfo>EARLY PAYMENT OPTION</ThWithInfo>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVendors.map((vendor) => (
            <tr
              key={vendor.id}
              className="transition-colors duration-200 hover:bg-gray-50"
            >
              <td className={TD_CLASS}>
                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {vendor.companyName}
                </div>
              </td>
              <td className={TD_CLASS}>
                <div className="text-sm text-gray-500">{vendor.companyId}</div>
              </td>
              <td className={TD_CLASS}>
                <div className="text-sm text-gray-900">{vendor.openPayables}</div>
              </td>
              <td className={TD_CLASS}>
                <div className="text-sm text-gray-700">{vendor.paymentTerms}</div>
              </td>
              <td className={TD_CLASS}>
                <div className="flex items-center gap-2">
                  {vendor.paymentMethods.map((method) => {
                    const cfg = PAYMENT_METHOD_ICONS[method];
                    if (!cfg) return null;
                    return (
                      <Icon
                        key={method}
                        icon={cfg.icon}
                        className={clsx("w-5 h-5", cfg.colorClass)}
                      />
                    );
                  })}
                </div>
              </td>
              <td className={TD_CLASS}>
                <PaymentNetworkSelect
                  vendor={vendor}
                  onSelect={handlePaymentNetworkSelect}
                />
              </td>
              <td className={TD_CLASS}>
                <div
                  className={clsx(
                    "text-sm font-medium",
                    vendor.earlyPaymentOption ? "text-green-600" : "text-gray-400"
                  )}
                >
                  {vendor.earlyPaymentOption ? "Available" : "Not available"}
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
