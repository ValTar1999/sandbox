import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import CheckBox from "./CheckBox";
import Icon from "./Icon";
import Button from "./Button";
import Badge from "./Badge";
import { Payment } from "../../pages/BillsPayables/data";
// import { focusButton } from '../../config/commonStyles';

// Img
import SD from '../../assets/image/SMART-Disburse.svg';

interface RootTableProps {
  payments: Payment[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onCancelClick: (payment: Payment) => void;
  onReRunClick: (payment: Payment) => void;
}

const classConstructor = {
  th: ['p-4'],
  thText: ['flex items-center text-start text-gray-500 text-xs uppercase tracking-wider font-medium'],
  td: ['p-4']
};

const flexAlignMap = {
  start: 'start',
  center: 'center',
  end: 'end',
};

const RootTable: React.FC<RootTableProps> = ({
  payments,
  selectedIds = [],
  onSelectionChange,
  onCancelClick,
  onReRunClick,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const currentIds = useMemo(() => payments.map((p) => p.id), [payments]);
  const allCurrentSelected =
    currentIds.length > 0 && currentIds.every((id) => selectedSet.has(id));
  const someCurrentSelected = currentIds.some((id) => selectedSet.has(id));

  useEffect(() => {
    const el = masterCheckboxRef.current;
    if (el) el.indeterminate = someCurrentSelected && !allCurrentSelected;
  }, [someCurrentSelected, allCurrentSelected]);

  const toggleExpand = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

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

  const handleCancelClick = (payment: Payment, e: React.MouseEvent) => {
    e.stopPropagation();
    onCancelClick(payment);
  };

  return (
    <div className="overflow-x-auto w-full px-6 grid">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-dashed border-gray-200">
            <th className="w-[52px] max-w-[52px] min-w-[52px]"></th>
            <th className={clsx(`w-8 max-w-8 min-w-8` ,`${classConstructor.td}`)}>
              <div className={clsx('flex', `justify-${flexAlignMap.center}`)}>
                <CheckBox
                  ref={masterCheckboxRef}
                  checked={payments.length > 0 ? allCurrentSelected : false}
                  onChange={() => handleMasterCheckboxChange()}
                />
              </div>
            </th>

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
                <button>
                  <div className="flex items-center gap-1">
                    <div className={clsx(classConstructor.thText)}>
                      amount
                    </div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex', `justify-${flexAlignMap.start}`)}>
                <button>
                  <div className="flex items-center gap-1">
                    <div className={clsx(classConstructor.thText)}>
                      bill reference
                    </div>
                    <Icon icon="selector" className="text-gray-400" />
                  </div>
                </button>
              </div>
            </th>

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.start}`)}>
                <button className="flex items-center gap-1">
                  <div className={clsx(classConstructor.thText)}>
                    payee
                  </div>
                  <Icon icon="selector" className="text-gray-400" />
                </button>
                <Button
                  icon="filter"
                  size="xs"
                  variant="linkSecondary"
                />
              </div>
            </th>

            {hasPaymentType && (
              <th className={clsx(classConstructor.th)}>
                <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.start}`)}>
                  <div className={clsx(classConstructor.thText)}>Payment Type</div>
                  <Button icon="filter" size="xs" variant="linkSecondary" />
                </div>
              </th>
            )}

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.start}`)}>
                <div className={clsx(classConstructor.thText)}>
                  source
                </div>
                <Button
                  icon="filter"
                  size="xs"
                  variant="linkSecondary"
                />
              </div>
            </th>

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.start}`)}>
                <div className={clsx(`text-nowrap` ,`${classConstructor.thText}`)}>
                  Due Date
                </div>
                <Icon icon="selector" className="text-gray-400" />
              </div>
            </th>

            <th className={clsx(classConstructor.th)}>
              <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.start}`)}>
                <div className={clsx(classConstructor.thText)}>
                  status
                </div>
              </div>
            </th>

          </tr>
        </thead>
        
        <tbody>
          {payments.map((payment) => (
            <React.Fragment key={payment.id}>
              <tr
                onClick={() => toggleExpand(payment.id)}
                className={clsx(
                  'hover:bg-gray-50 cursor-pointer transition-all duration-500',
                  expandedRow === payment.id && "bg-gray-100",
                  selectedSet.has(payment.id) && "bg-blue-50"
                )}
              >
                <td className="w-[52px] max-w-[52px] min-w-[52px]">
                  <Icon
                    icon="chevron-right"
                    className={clsx(
                      'ml-4',
                      selectedSet.has(payment.id) ? "text-blue-500" : "text-gray-500",
                      expandedRow === payment.id && "rotate-90"
                    )}
                  />
                </td>

                <td className={clsx(`w-8 max-w-8 min-w-8` ,`${classConstructor.td}`)}>
                  <div className={clsx('flex', `justify-${flexAlignMap.center}`)}>
                    <CheckBox
                      checked={selectedSet.has(payment.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleRowCheckboxChange(payment.id, e.target.checked)
                      }
                    />
                  </div>
                </td>

                <td className={clsx(`w-[186px] max-w-[186px] min-w-[186px]`,`${classConstructor.td}`)}>
                  <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.end}`)}>
                    {payment.lock ? (
                      <Icon className="text-gray-500" icon="lock-closed" />
                    ) : null}
                    <div className="font-medium text-gray-900 text-sm">{payment.totalAmount}</div>
                    <div className="text-gray-500">{payment.amountValute}</div>
                  </div>
                </td>

                <td className={clsx(`w-[140px] max-w-[140px] min-w-[140px]`,`${classConstructor.td}`)}>
                  <div className={clsx('text-sm text-gray-500 flex', `justify-${flexAlignMap.start}`)}>
                    {payment.billReference}
                  </div>
                </td>

                <td className={clsx(`min-w-0 max-w-xs overflow-hidden`,`${classConstructor.td}`)}>
                  <div className={clsx('flex items-center gap-2', `justify-${flexAlignMap.start}`)}> 
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
                  <td className={clsx(classConstructor.td)}>
                    <div className={clsx('flex items-center gap-2', `justify-${flexAlignMap.start}`)}> 
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

                <td className={clsx(classConstructor.td)}>
                  <div className={clsx('text-sm text-gray-900 flex font-medium', `justify-${flexAlignMap.start}`)}>
                    {payment.source}
                  </div>
                </td>

                <td className={clsx(classConstructor.td)}>
                  <div className={clsx('text-sm  flex', `justify-${flexAlignMap.start}`)}>
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

                <td className={clsx(classConstructor.td)}>
                  <div className={clsx('flex', `justify-${flexAlignMap.start}`)}>
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
                    {payment.status === "pastDue" && (
                      <Badge color="red" icon="calendar" iconDirection="left">
                        Past Due
                      </Badge>
                    )}
                  </div>
                </td>

                {payment.status === "unprocessed" && (                  
                <td className="px-4">
                  <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
                    <Button size="md"  onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/payables/${payment.id}`);
                    }}>Pay
                    </Button>
                  </div>
                </td>
                )}

                {payment.status === "processed" && (                  
                  <td className="px-4">
                    <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
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
                <td className="px-4">
                  <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
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

                {payment.status === "pastDue" && (
                  <td className={clsx(classConstructor)}></td>
                )}

              </tr>

              {/* Анимированный блок */}
              <tr className="border-b border-gray-200">
                <td colSpan={8} className="transition-all duration-500">
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedRow === payment.id ? 'max-h-[500px]' : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">Notes</div>
                        <div className="px-4 py-3.5 text-sm font-medium text-gray-900">{payment.notes}</div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">Status</div>
                        <div className="px-4 py-3.5">
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
                          {payment.status === "pastDue" && (
                            <Badge color="red" icon="calendar" iconDirection="left">
                              Past Due
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">Attachments</div>
                        <div className="px-4 py-3.5">
                          <Badge>{payment.attachments}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RootTable;
