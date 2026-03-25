import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import CheckBox from "./CheckBox";
import Icon from "./Icon";
import Button from "./Button";
import Badge from "./Badge";
import ExpandableTableRow from "./ExpandableTableRow";
import ExpandableRow from "./ExpandableRow";
import Menu, { useMenuContext } from "./Menu";
import Input from "./Input";
import { Payment } from "../../../pages/BillsPayables/data";
import { STATUS_BADGES } from "../../../constants/tableStatusBadges";
import {
  TH_CLASS,
  TH_TEXT_CLASS,
  TD_CLASS,
  FLEX_END,
  FLEX_START,
  FLEX_CENTER,
} from "../../../constants/tableStyles";
import SD from "../../../assets/image/SMART-Disburse.svg";

interface RootTableProps {
  payments: Payment[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onCancelClick: (payment: Payment) => void;
  onReRunClick: (payment: Payment) => void;
  onCancelBulkPaymentClick?: (payment: Payment) => void;
}

const renderStatusBadge = (status: Payment["status"]) => {
  const config = STATUS_BADGES[status as keyof typeof STATUS_BADGES];
  if (!config) return null;
  return (
    <Badge color={config.color} icon={config.icon} iconDirection="left">
      {config.label}
    </Badge>
  );
};

const RootTable: React.FC<RootTableProps> = ({
  payments,
  selectedIds = [],
  onSelectionChange,
  onCancelClick,
  onReRunClick,
  onCancelBulkPaymentClick,
}) => {
  const [selectedPayees, setSelectedPayees] = useState<string[]>([]);
  const [tempSelectedPayees, setTempSelectedPayees] = useState<string[]>([]);
  const [payeeSearch, setPayeeSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const allPayees = useMemo(
    () => Array.from(new Set(payments.map((p) => p.payee).filter(Boolean))),
    [payments]
  );

  const filteredPayments = useMemo(
    () =>
      selectedPayees.length === 0
        ? payments
        : payments.filter((p) => selectedPayees.includes(p.payee)),
    [payments, selectedPayees]
  );

  const currentIds = useMemo(
    () => filteredPayments.map((p) => p.id),
    [filteredPayments]
  );

  const allCurrentSelected =
    currentIds.length > 0 && currentIds.every((id) => selectedSet.has(id));
  const someCurrentSelected = currentIds.some((id) => selectedSet.has(id));

  useEffect(() => {
    const el = masterCheckboxRef.current;
    if (el) el.indeterminate = someCurrentSelected && !allCurrentSelected;
  }, [someCurrentSelected, allCurrentSelected]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  }, []);

  const handleMasterCheckboxChange = () => {
    if (!onSelectionChange) return;
    if (allCurrentSelected) {
      onSelectionChange(selectedIds.filter((id) => !currentIds.includes(id)));
    } else {
      const toAdd = currentIds.filter((id) => !selectedSet.has(id));
      onSelectionChange([...selectedIds, ...toAdd]);
    }
  };

  const handleRowCheckboxChange = (paymentId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, paymentId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== paymentId));
    }
  };

  const hasPaymentType = useMemo(
    () => payments.some(payment => payment.paymentType),
    [payments]
  );

  const visiblePayees = useMemo(
    () =>
      payeeSearch
        ? allPayees.filter((name) =>
            name.toLowerCase().includes(payeeSearch.toLowerCase())
          )
        : allPayees,
    [allPayees, payeeSearch]
  );

  const handleOpenPayeeFilter = () => {
    setTempSelectedPayees(selectedPayees);
    setPayeeSearch("");
  };

  const handleApplyPayeeFilter = () => {
    setSelectedPayees(tempSelectedPayees);
  };

  const handleResetPayeeFilter = () => {
    setTempSelectedPayees([]);
  };

  const toggleTempPayee = (name: string) => {
    setTempSelectedPayees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleCancelClick = useCallback(
    (payment: Payment, e: React.MouseEvent) => {
      e.stopPropagation();
      onCancelClick(payment);
    },
    [onCancelClick]
  );

  const PayeeFilterTooltipContent: React.FC = () => {
    const { setOpen } = useMenuContext();

    const handleClose = () => setOpen(false);

    const handleApply = () => {
      handleApplyPayeeFilter();
      setOpen(false);
    };

    return (
      <div className="w-[352px] rounded-lg border border-gray-200 bg-white shadow-sm divide-y divide-gray-200">
        <div className="flex items-center justify-between pl-6 pr-4 py-3">
          <div className="text-lg leading-6 font-medium text-gray-900">
            Filter by Payee
          </div>
          <Button
            variant="linkSecondary"
            size="lg"
            onClick={handleClose}
            icon="x"
          >
          </Button>
        </div>
        <div className="px-6 py-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Payee Name
            </div>
            <Input
              placeholder="Search payee"
              value={payeeSearch}
              onChange={(e) => setPayeeSearch(e.target.value)}
            />
          </div>
          <div className="mt-3 max-h-56 space-y-1 overflow-y-auto pr-1">
            {visiblePayees.map((name) => (
              <label
                key={name}
                className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-900"
              >
                <CheckBox
                  checked={tempSelectedPayees.includes(name)}
                  onChange={() => toggleTempPayee(name)}
                />
                <span className="truncate">{name}</span>
              </label>
            ))}
            {visiblePayees.length === 0 && (
              <div className="py-2 text-xs text-gray-400">No payees found</div>
            )}
          </div>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleResetPayeeFilter}>
            Reset all
          </Button>
          <Button className="w-full" variant="primary" size="lg" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto w-full px-6 grid">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className="w-[52px] max-w-[52px] min-w-[52px]"></th>
            <th className={clsx("w-8 max-w-8 min-w-8", TD_CLASS)}>
              <div className={FLEX_CENTER}>
                <CheckBox
                  ref={masterCheckboxRef}
                  checked={filteredPayments.length > 0 ? allCurrentSelected : false}
                  onChange={() => handleMasterCheckboxChange()}
                />
              </div>
            </th>

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
                    <div className={TH_TEXT_CLASS}>bill reference</div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={TH_CLASS}>
              <div className={clsx("flex items-center gap-1", "justify-start")}>
                <button className="flex items-center gap-1">
                  <div className={TH_TEXT_CLASS}>payee</div>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
                <Menu.Root placement="bottom-end">
                  <Menu.Trigger as="span" onClick={handleOpenPayeeFilter}>
                    <Button
                      icon="filter"
                      size="xs"
                      variant="linkSecondary"
                    />
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner>
                      <Menu.Popup className="z-50">
                        <Menu.Arrow className="fill-white text-gray-200" />
                        <PayeeFilterTooltipContent />
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </div>
            </th>

            {hasPaymentType && (
              <th className={TH_CLASS}>
                <div className={clsx("flex items-center gap-1", "justify-start")}>
                  <div className={TH_TEXT_CLASS}>Payment Type</div>
                  <Button icon="filter" size="xs" variant="linkSecondary" />
                </div>
              </th>
            )}

            <th className={TH_CLASS}>
              <div className={clsx("flex items-center gap-1", "justify-start")}>
                <div className={TH_TEXT_CLASS}>source</div>
                <Button
                  icon="filter"
                  size="xs"
                  variant="linkSecondary"
                />
              </div>
            </th>

            <th className={TH_CLASS}>
              <div className={clsx("flex items-center gap-1", "justify-start")}>
                <div className={clsx("text-nowrap", TH_TEXT_CLASS)}>Due Date</div>
                <Icon icon="selector" className="text-gray-400" />
              </div>
            </th>

            <th className={TH_CLASS}>
              <div className={clsx("flex items-center gap-1", "justify-start")}>
                <div className={TH_TEXT_CLASS}>status</div>
              </div>
            </th>

          </tr>
        </thead>
        
        <tbody>
          {filteredPayments.map((payment) => (
            <React.Fragment key={payment.id}>
              <tr
                onClick={() => toggleExpand(payment.id)}
                className={clsx(
                  'hover:bg-gray-50 cursor-pointer transition-colors duration-300 ease-in-out',
                  expandedRow === payment.id && "bg-gray-100",
                  selectedSet.has(payment.id) && "bg-blue-50"
                )}
              >
                <td className="w-[52px] max-w-[52px] min-w-[52px]">
                  <Icon
                    icon="chevron-right"
                    className={clsx(
                      'ml-4 transition-transform duration-300 ease-in-out',
                      selectedSet.has(payment.id) ? "text-blue-500" : "text-gray-500",
                      expandedRow === payment.id && "rotate-90"
                    )}
                  />
                </td>

                <td className={clsx("w-8 max-w-8 min-w-8", TD_CLASS)}>
                  <div className={FLEX_CENTER}>
                    <CheckBox
                      checked={selectedSet.has(payment.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleRowCheckboxChange(payment.id, e.target.checked)
                      }
                    />
                  </div>
                </td>

                <td className={clsx("w-[186px] max-w-[186px] min-w-[186px]", TD_CLASS)}>
                  <div className={clsx("flex items-center gap-1", "justify-end")}>
                    {payment.lock ? (
                      <Icon className="text-gray-500" icon="lock-closed" />
                    ) : null}
                    <div className="font-medium text-gray-900 text-sm">{payment.totalAmount}</div>
                    <div className="text-gray-500">{payment.amountValute}</div>
                  </div>
                </td>

                <td className={clsx("w-[140px] max-w-[140px] min-w-[140px]", TD_CLASS)}>
                  <div className={clsx("text-sm text-gray-500 flex", "justify-start")}>
                    {payment.billReference}
                  </div>
                </td>

                <td className={clsx("min-w-0 max-w-xs overflow-hidden", TD_CLASS)}>
                  <div className={clsx("flex items-center gap-2", "justify-start")}> 
                    {payment.vendors && payment.vendors.length > 0 && (
                      <Badge size="lg" rounded color="gray">
                        {payment.vendors.length}
                      </Badge>
                    )}
                    <div className="text-sm text-gray-900 font-medium truncate">
                      {payment.payee}
                    </div>
                  </div>
                </td>

                {payment.paymentType && (
                  <td className={TD_CLASS}>
                    <div className={clsx("flex items-center gap-2", "justify-start")}> 
                      {payment.paymentType === 'sd' ? (
                        <>
                          <img
                            className="w-4.5 h-4.5"
                            src={SD}
                            alt="icon-sd"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="text-sm text-gray-900">SMART Disburse</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-900">{payment.paymentType}</div>
                      )}
                    </div>
                  </td>
                )}

                <td className={TD_CLASS}>
                  <div className={clsx("text-sm text-gray-900 flex font-medium", "justify-start")}>
                    {payment.source}
                  </div>
                </td>

                <td className={TD_CLASS}>
                  <div className={clsx("text-sm flex", "justify-start")}>
                    {payment.status === "pastDue" ? (
                      <div className="flex items-center gap-1">
                        <div className="text-yellow-600 text-nowrap">{payment.dueDate}</div>
                        <Icon className="text-yellow-500" icon="exclamation-circle"/>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-nowrap">
                        {payment.dueDate}
                      </div>
                    )}
                  </div>
                </td>

                <td className={TD_CLASS}>
                  <div className={FLEX_START}>{renderStatusBadge(payment.status)}</div>
                </td>

                {payment.status === "unprocessed" && (
                  <td className="pl-4">
                    <div className={FLEX_END}>
                    <Button size="md"  onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/payables/${payment.id}`);
                    }}>Pay
                    </Button>
                    </div>
                  </td>
                )}

                {payment.status === "processed" && (
                  <td className="pl-4">
                    <div className={FLEX_END}>
                      <Button
                        variant="gray"
                        size="md"
                        onClick={(e) => handleCancelClick(payment, e)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                )}

                {payment.status === "failed" && (
                  <td className="pl-4">
                    <div className={FLEX_END}>
                    <Button 
                      icon="x" 
                      iconDirection="right" 
                      variant="gray" 
                      size="md" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onReRunClick(payment);
                      }}
                    >
                      Re-Run
                    </Button>
                    </div>
                  </td>
                )}

                {payment.status === "pastDue" && <td className={TD_CLASS}></td>}

              </tr>

              <ExpandableTableRow colSpan={8} isExpanded={expandedRow === payment.id}>
                <div className="flex flex-col">
                  <ExpandableRow label="Notes">
                    <span className="text-sm font-medium text-gray-900">{payment.notes}</span>
                  </ExpandableRow>
                  <ExpandableRow label="Status">
                    {renderStatusBadge(payment.status)}
                  </ExpandableRow>
                  <ExpandableRow label="Attachments" borderTop>
                    <Badge>{payment.attachments}</Badge>
                  </ExpandableRow>
                  {payment.status === "processed" && (
                    <ExpandableRow label="Actions" borderTop>
                      <Button
                        variant="gray"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onCancelBulkPaymentClick) {
                            onCancelBulkPaymentClick(payment);
                          } else {
                            onCancelClick(payment);
                          }
                        }}
                      >
                        Cancel Payment
                      </Button>
                    </ExpandableRow>
                  )}
                </div>
              </ExpandableTableRow>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RootTable;
