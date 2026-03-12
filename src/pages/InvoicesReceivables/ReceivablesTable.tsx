import React, { useCallback, useState } from "react";
import clsx from "clsx";
import Icon from "../../component/base/Icon";
import Button from "../../component/base/Button";
import Badge from "../../component/base/Badge";
import ExpandableTableRow from "../../component/base/ExpandableTableRow";
import ExpandableRow from "../../component/base/ExpandableRow";
import Menu, { useMenuContext } from "../../component/base/Menu";
import {
  Receivable,
  ReceivableStatus,
  PaymentType,
  PaymentMethodItem,
} from "./data";
import { STATUS_BADGES } from "../../constants/tableStatusBadges";
import {
  TH_CLASS,
  TH_TEXT_CLASS,
  TD_CLASS,
  FLEX_END,
  FLEX_START,
} from "../../constants/tableStyles";
import MastercardFlag from "../../assets/image/mastercard-flag.svg";
import SmartCollectIcon from "../../assets/image/SMART-Collect.svg";

interface ReceivablesTableProps {
  receivables: Receivable[];
  activeTab?: ReceivableStatus;
  onInvoiceClick?: (receivable: Receivable) => void;
  onReRunClick?: (receivable: Receivable) => void;
  onCancelClick?: (receivable: Receivable, paymentMethod?: PaymentMethodItem) => void;
}

const ACTIVITY_LOG_ICONS: Record<string, { icon: string; className: string }> = {
  paid: { icon: "check-circle", className: "w-3.5 h-3.5 text-green-500" },
  processing: { icon: "in-progress", className: "w-3.5 h-3.5 text-blue-500" },
  initiated: { icon: "in-progress", className: "w-3.5 h-3.5 text-blue-500" },
  failed: { icon: "exclamation-circle", className: "w-3.5 h-3.5 text-red-500" },
  pending: { icon: "calendar", className: "w-3.5 h-3.5 text-gray-500" },
};

const ThWithInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1">
    <span className={TH_TEXT_CLASS}>{children}</span>
    <Icon icon="information-circle" className="w-4 h-4 text-gray-400" />
  </div>
);

const IN_PROGRESS_STATUS_BADGES: Record<
  PaymentMethodItem["status"],
  { color: "blue" | "yellow" | "red"; icon: string; label: string }
> = {
  waitingOnCustomer: { color: "yellow", icon: "user", label: "Waiting on Customer" },
  inProcess: { color: "blue", icon: "in-progress", label: "In Process" },
  pastDue: { color: "red", icon: "calendar", label: "Past Due" },
};

const renderStatusBadge = (status: Receivable["status"]) => {
  const config = STATUS_BADGES[status as keyof typeof STATUS_BADGES];
  if (!config) return null;
  return (
    <Badge color={config.color} icon={config.icon} iconDirection="left">
      {config.label}
    </Badge>
  );
};

const renderInProgressStatusBadge = (status: PaymentMethodItem["status"]) => {
  const config = IN_PROGRESS_STATUS_BADGES[status];
  if (!config) return null;
  return (
    <Badge color={config.color} icon={config.icon} iconDirection="left">
      {config.label}
    </Badge>
  );
};

const getPaymentTypeLabel = (receivable: Receivable, isInProgress: boolean): string => {
  if (isInProgress) {
    const primaryPm = receivable.paymentMethods?.[0];
    if (!primaryPm) return "-";
    return primaryPm.type === "smartCollect"
      ? "SMART Collect"
      : primaryPm.type === "bank"
        ? "Bank"
        : primaryPm.type === "card"
          ? "Card"
          : primaryPm.label;
  }
  const pt = receivable.paymentType;
  if (!pt) return "-";
  return pt === "smartCollect"
    ? "SMART Collect"
    : pt === "bank"
      ? "Bank"
      : pt === "card"
        ? "Card"
        : pt.toUpperCase();
};

const getActivityLogIcon = (status: string) => {
  const { icon, className } = ACTIVITY_LOG_ICONS[status] ?? ACTIVITY_LOG_ICONS.pending;
  return <Icon icon={icon} className={className} />;
};

const getActivityLogStatusLabel = (status: string) =>
  status === "pending" ? "Pending Initiation" : status.charAt(0).toUpperCase() + status.slice(1);

const renderDescriptionWithHighlightedId = (description: string) =>
  description.split(/(#\w+)/g).map((part, i) =>
    part.match(/^#\w+$/) ? (
      <a href="#" key={i} className="text-blue-600 font-medium">{part}</a>
    ) : (
      part
    )
  );

const StatusFilterContent: React.FC = () => {
  const { setOpen } = useMenuContext();
  return (
    <div className="w-[200px] rounded-lg border border-gray-200 bg-white shadow-sm p-4">
      <div className="text-sm font-medium text-gray-900 mb-2">Filter by Status</div>
      <div className="space-y-2 text-sm text-gray-700">
        <div>Unprocessed</div>
        <div>Processing</div>
        <div>Paid</div>
        <div>Failed</div>
      </div>
      <Button className="mt-4 w-full" variant="primary" size="md" onClick={() => setOpen(false)}>
        Apply
      </Button>
    </div>
  );
};

const FilterContent: React.FC = () => {
  const { setOpen } = useMenuContext();
  return (
    <div className="w-[200px] rounded-lg border border-gray-200 bg-white shadow-sm p-4">
      <Button className="w-full" variant="primary" size="md" onClick={() => setOpen(false)}>
        Apply
      </Button>
    </div>
  );
};

const PaymentMethodDisplay: React.FC<{
  type: PaymentType;
  label: string;
  accountId?: string;
}> = ({ type, label, accountId }) => {
  const isBankOrCardWithId = (type === "bank" || type === "card") && accountId;
  const displayLabel =
    type === "bank" && accountId
      ? accountId
      : type === "card" && accountId
        ? accountId
        : type === "smartCollect"
          ? "SMART Collect"
          : label;
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium text-nowrap">
      {isBankOrCardWithId && (
        <>
          <img src={SmartCollectIcon} alt="" className="w-4 h-4" />
          <Icon icon="chevron-right" className="w-5 h-5 text-gray-500" />
        </>
      )}
      {type === "smartCollect" && !isBankOrCardWithId && (
        <img src={SmartCollectIcon} alt="" className="w-4 h-4" />
      )}
      {type === "bank" && (
        <Icon icon="library" className="w-5 h-5 text-gray-500" />
      )}
      {type === "card" && (
        <img src={MastercardFlag} alt="" className="h-4 w-6" />
      )}
      <span>{displayLabel}</span>
    </div>
  );
};

const ReceivablesTable: React.FC<ReceivablesTableProps> = ({
  receivables,
  activeTab = "Ready to Invoice",
  onInvoiceClick,
  onReRunClick,
  onCancelClick,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [expandedActivityLogIds, setExpandedActivityLogIds] = useState<Set<string>>(new Set());

  const toggleActivityLogExpand = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedActivityLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  const handleInvoiceClick = useCallback(
    (receivable: Receivable, e: React.MouseEvent) => {
      e.stopPropagation();
      onInvoiceClick?.(receivable);
    },
    [onInvoiceClick]
  );

  const handleReRunClick = useCallback(
    (receivable: Receivable, e: React.MouseEvent) => {
      e.stopPropagation();
      onReRunClick?.(receivable);
    },
    [onReRunClick]
  );

  const handleCancelClick = useCallback(
    (
      receivable: Receivable,
      paymentMethod: PaymentMethodItem | undefined,
      e: React.MouseEvent
    ) => {
      e.stopPropagation();
      onCancelClick?.(receivable, paymentMethod);
    },
    [onCancelClick]
  );

  const isInProgress = activeTab === "In Progress";
  const showPaymentType =
    activeTab === "Paid" || activeTab === "Exceptions" || isInProgress;

  const getPaymentTypeContent = (receivable: Receivable) => {
    if (isInProgress) {
      const primaryPm = receivable.paymentMethods?.[0];
      return primaryPm ? (
        <PaymentMethodDisplay
          type={primaryPm.type}
          label={primaryPm.label}
          accountId={primaryPm.accountId}
        />
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    }
    const pt = receivable.paymentType;
    if (!pt) return null;
    return (
      <PaymentMethodDisplay
        type={pt}
        label={
          pt === "smartCollect"
            ? "SMART Collect"
            : pt === "bank"
              ? "Bank"
              : pt === "card"
                ? "Card"
                : pt.toUpperCase()
        }
        accountId={receivable.accountId}
      />
    );
  };

  const getStatusContent = (receivable: Receivable) => {
    if (isInProgress) {
      const primaryPm = receivable.paymentMethods?.[0];
      return primaryPm ? (
        renderInProgressStatusBadge(primaryPm.status)
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    }
    return renderStatusBadge(receivable.status);
  };

  const getActionContent = (receivable: Receivable) => {
    if (isInProgress) {
      const primaryPm = receivable.paymentMethods?.[0];
      return (
        <div className={FLEX_END}>
          <Button
            size="md"
            variant="gray"
            onClick={(e) => handleCancelClick(receivable, primaryPm, e)}
          >
            Cancel
          </Button>
        </div>
      );
    }
    if (receivable.status === "unprocessed") {
      return (
        <div className={FLEX_END}>
          <Button
            size="md"
            onClick={(e) => handleInvoiceClick(receivable, e)}
          >
            Invoice
          </Button>
        </div>
      );
    }
    if (receivable.status === "failed") {
      return (
        <div className={FLEX_END}>
          <Button
            size="md"
            variant="gray"
            onClick={(e) => handleReRunClick(receivable, e)}
          >
            Re-run
          </Button>
        </div>
      );
    }
    return null;
  };

  const getExpandableContent = (receivable: Receivable) => {
    const statusContent = isInProgress ? (
      receivable.paymentMethods?.[0] ? (
        renderInProgressStatusBadge(receivable.paymentMethods[0].status)
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )
    ) : (
      renderStatusBadge(receivable.status)
    );
    return (
      <div className="flex flex-col">
        <ExpandableRow label="Notes">
          <span className="text-sm font-medium text-gray-900">
            {receivable.notes || "-"}
          </span>
        </ExpandableRow>
        <ExpandableRow label="Status">
          {statusContent}
        </ExpandableRow>
        {showPaymentType && (
          <ExpandableRow label="Payment type">
            <span className="text-sm font-medium text-gray-900">
              {getPaymentTypeLabel(receivable, isInProgress)}
            </span>
          </ExpandableRow>
        )}
        <ExpandableRow label="Attachments" borderTop>
          <div className="flex flex-wrap gap-2">
            {receivable.attachments?.length ? (
              receivable.attachments.map((filename) => (
                <div
                  key={filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-sm font-medium text-gray-900"
                >
                  <Icon icon="document-text" className="w-4 h-4 text-gray-500" />
                  {filename}
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        </ExpandableRow>
        {receivable.status === "failed" && (
          <ExpandableRow label="Actions" borderTop>
            <Button
              size="md"
              variant="gray"
              icon="refresh"
              onClick={(e) => handleReRunClick(receivable, e)}
            >
              Re-run
            </Button>
          </ExpandableRow>
        )}
        {receivable.activityLog && receivable.activityLog.length > 0 && (
          <ExpandableRow label="Activity log" borderTop>
            <div className="relative pl-5">
              <div className="space-y-0">
                {(expandedActivityLogIds.has(receivable.id)
                  ? receivable.activityLog
                  : receivable.activityLog.slice(0, 3)
                ).map((item, index, arr) => {
                  const hasMoreItems =
                    !expandedActivityLogIds.has(receivable.id) &&
                    receivable.activityLog!.length > 3;
                  const showLine =
                    index < arr.length - 1 ||
                    (index === arr.length - 1 && hasMoreItems);

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0 -ml-5 mt-1">
                        {getActivityLogIcon(item.status)}
                        {showLine && (
                          <div className="w-0.5 flex-1 min-h-4 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-6 flex flex-col gap-1.5">
                        <div className="font-medium text-gray-900 text-base leading-5">
                          {getActivityLogStatusLabel(item.status)}.
                        </div>
                        <div className="text-gray-700">
                          {renderDescriptionWithHighlightedId(item.description)}
                        </div>
                        <div className="text-sm text-gray-400 leading-5 font-medium">
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {receivable.activityLog.length > 3 && (
                <Button
                  variant="linkPrimary"
                  size="sm"
                  icon="chevron-down"
                  iconDirection="right"
                  iconClass={clsx(expandedActivityLogIds.has(receivable.id) && "rotate-180")}
                  onClick={(e) => toggleActivityLogExpand(receivable.id, e)}
                >
                  {expandedActivityLogIds.has(receivable.id) ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
          </ExpandableRow>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto w-full px-6 grid">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className="w-[52px] max-w-[52px] min-w-[52px]"></th>

            <th className={TH_CLASS}>
              <div className={FLEX_END}>
                <button>
                  <div className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>amount</div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <button>
                  <div className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>
                      invoice number
                    </div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div className={FLEX_START}>
                <button>
                  <div className="flex items-center gap-1">
                    <div className={TH_TEXT_CLASS}>customer</div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div
                className={clsx(
                  "flex items-center gap-1",
                  "justify-start"
                )}
              >
                <button className="flex items-center gap-1">
                  <ThWithInfo>created</ThWithInfo>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div
                className={clsx(
                  "flex items-center gap-1",
                  "justify-start"
                )}
              >
                <button className="flex items-center gap-1">
                  <ThWithInfo>due</ThWithInfo>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div
                className={clsx(
                  "flex items-center gap-1",
                  "justify-start"
                )}
              >
                <button className="flex items-center gap-1">
                  <ThWithInfo>presented</ThWithInfo>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div
                className={clsx(
                  "flex items-center gap-1",
                  "justify-start"
                )}
              >
                <button className="flex items-center gap-1">
                  <ThWithInfo>expected</ThWithInfo>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
              </div>
            </th>

            {showPaymentType && (
              <th className={TH_CLASS}>
                <div
                  className={clsx(
                    "flex items-center gap-1",
                    "justify-start"
                  )}
                >
                  <div className={TH_TEXT_CLASS}>
                    payment type
                  </div>
                  <Menu.Root placement="bottom-end">
                    <Menu.Trigger as="span">
                      <Button icon="filter" size="xs" variant="linkSecondary" />
                    </Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner>
                        <Menu.Popup className="z-50">
                          <Menu.Arrow className="fill-white text-gray-200" />
                          <FilterContent />
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </div>
              </th>
            )}

            <th className={TH_CLASS}>
              <div
                className={clsx(
                  "flex items-center gap-1",
                  "justify-start"
                )}
              >
                <div className={TH_TEXT_CLASS}>status</div>
                <Menu.Root placement="bottom-end">
                  <Menu.Trigger as="span">
                    <Button icon="filter" size="xs" variant="linkSecondary" />
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup className="z-50">
                        <Menu.Arrow className="fill-white text-gray-200" />
                        <StatusFilterContent />
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </div>
            </th>

            <th className="w-[100px]"></th>
          </tr>
        </thead>

        <tbody>
          {receivables.map((receivable) => {
            const primaryPm = receivable.paymentMethods?.[0];
            const isPastDue = primaryPm?.status === "pastDue";

            return (
              <React.Fragment key={receivable.id}>
                <tr
                  onClick={() => toggleExpand(receivable.id)}
                  className={clsx(
                    "transition-colors duration-300 ease-in-out",
                    "hover:bg-gray-50 cursor-pointer",
                    expandedRow === receivable.id && "bg-gray-100"
                  )}
                >
                  <td className="w-[52px] max-w-[52px] min-w-[52px]">
                    <Icon
                      icon="chevron-right"
                      className={clsx(
                        "ml-4 text-gray-500 transition-transform duration-300 ease-in-out",
                        expandedRow === receivable.id && "rotate-90"
                      )}
                    />
                  </td>

                  <td
                    className={clsx("w-[186px] max-w-[186px] min-w-[186px]", TD_CLASS)}
                  >
                    <div
                      className={clsx(
                        "flex items-center gap-1",
                        "justify-end"
                      )}
                    >
                      <div className="font-medium text-gray-900 text-sm">
                        {receivable.amount}
                      </div>
                      <div className="text-gray-500">
                        {receivable.amountCurrency}
                      </div>
                    </div>
                  </td>

                  <td
                    className={clsx(
                      "w-[140px] max-w-[140px] min-w-[140px]",
                      TD_CLASS
                    )}
                  >
                    <div
                      className={clsx(
                        "text-sm text-gray-500 flex text-nowrap",
                        "justify-start"
                      )}
                    >
                      {receivable.invoiceNumber}
                    </div>
                  </td>

                  <td
                    className={clsx(
                      "min-w-0 max-w-xs overflow-hidden",
                      TD_CLASS
                    )}
                  >
                    <div
                      className={clsx(
                        "text-sm text-gray-900 font-medium truncate",
                        "justify-start"
                      )}
                    >
                      {receivable.customer}
                    </div>
                  </td>

                  <td className={TD_CLASS}>
                    <div
                      className={clsx(
                        "text-sm text-gray-500 flex text-nowrap",
                        "justify-start"
                      )}
                    >
                      {receivable.created}
                    </div>
                  </td>

                  <td className={TD_CLASS}>  
                    <div
                      className={clsx(
                        "text-sm text-gray-500 flex text-nowrap",
                        "justify-start"
                      )}
                    >
                      {receivable.due}
                    </div>
                  </td>

                  <td className={TD_CLASS}>
                    <div
                      className={clsx(
                        "flex items-center text-nowrap text-sm text-gray-500",
                        "justify-start"
                      )}
                    >
                      {receivable.presented}
                    </div>
                  </td>

                  <td className={TD_CLASS}>
                    <div
                      className={clsx(
                        "text-sm flex text-nowrap items-center gap-1",
                        "justify-start",
                        isPastDue ? "text-yellow-600 font-medium" : "text-gray-500"
                      )}
                    >
                      {receivable.expected}
                      {isPastDue && (
                        <Icon
                          icon="information-circle"
                          className="w-4 h-4 text-yellow-500"
                        />
                      )}
                    </div>
                  </td>

                  {showPaymentType && (
                    <td className={TD_CLASS}>
                      <div
                        className={clsx(
                          "flex",
                          "justify-start"
                        )}
                      >
                        {getPaymentTypeContent(receivable)}
                      </div>
                    </td>
                  )}

                  <td className={TD_CLASS}>
                    <div
                      className={clsx(
                        "flex",
                        "justify-start"
                      )}
                    >
                      {getStatusContent(receivable)}
                    </div>
                  </td>

                  <td className="pl-4">{getActionContent(receivable)}</td>
                </tr>

                <ExpandableTableRow
                  colSpan={showPaymentType ? 11 : 10}
                  isExpanded={expandedRow === receivable.id}
                >
                  {getExpandableContent(receivable)}
                </ExpandableTableRow>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReceivablesTable;
