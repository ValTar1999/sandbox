import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckBox from "./CheckBox";
import Icon from "./Icon";
import Button from "./Button";
import Badge from "./Badge";
import clsx from "clsx";
// import { focusButton } from '../../config/commonStyles';

// Типы для columns и data
interface Payment {
  id: string;
  totalAmount: string;
  amountValute: string;
  billReference: string;
  payee: string;
  source: string;
  dueDate: string; // Исправлено dueData → dueDate
  status: string;
  notes: string;
  attachments: string;
}

interface RootTableProps {
  payments: Payment[]; // Заменяем columns и data на единый массив
}

const RootTable: React.FC<RootTableProps> = ({ payments  }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const navigate = useNavigate();
  const toggleExpand = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const classConstructor = {
    th: ['p-4'],
    thText: ['flex items-center text-gray-500 text-xs uppercase tracking-wider font-medium whitespace-nowrap'],
    td: ['p-4']
  };

  const flexAlignMap = {
    start: 'start',
    center: 'center',
    end: 'end',
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-dashed border-gray-200">
          <th></th>
          <th className={clsx(classConstructor.th)}>
            <div className={clsx('flex', `justify-${flexAlignMap.start}`)}>
              <CheckBox />
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
              <div className={clsx(classConstructor.thText)}>
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
                'hover:bg-gray-50 cursor-pointer transition-all duration-300',
                expandedRow === payment.id  && "bg-gray-100"
              )}
            >
              <td>
                <Icon 
                  icon="chevron-right" 
                  className={clsx(
                    'text-gray-500',
                    expandedRow === payment.id && "rotate-90"
                  )}
                />
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('flex', `justify-${flexAlignMap.start}`)}>
                  <CheckBox onClick={(e) => e.stopPropagation()} />
                </div>
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('flex items-center gap-1', `justify-${flexAlignMap.end}`)}>
                  <div className="font-medium text-gray-900">{payment.totalAmount}</div>
                  <div className="text-gray-500">{payment.amountValute}</div>
                </div>
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('text-sm text-gray-500 flex', `justify-${flexAlignMap.start}`)}>
                  {payment.billReference}
                </div>
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('text-sm text-gray-900 flex', `justify-${flexAlignMap.start}`)}>
                  {payment.payee}
                </div>
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('text-sm text-gray-900 flex', `justify-${flexAlignMap.start}`)}>
                  {payment.source}
                </div>
              </td>
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('text-sm text-gray-500 flex', `justify-${flexAlignMap.start}`)}>
                  {payment.dueDate}
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
                </div>
              </td>
              {payment.status === "unprocessed" && (                  
              <td className={clsx(classConstructor.td)}>
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
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
                    <Button variant="gray" size="md" onClick={(e) => e.stopPropagation()}>Cancel</Button>
                </div>
              </td>
              )}
              {payment.status === "failed" && (                  
              <td className={clsx(classConstructor.td)}>
                <div className={clsx('flex', `justify-${flexAlignMap.end}`)}>
                    <Button icon="x" iconDirection="right" variant="gray" size="md" onClick={(e) => e.stopPropagation()}>Re-Run</Button>
                </div>
              </td>
              )}

            </tr>

            {/* Анимированный блок */}
            <tr className="border-b border-gray-200">
              <td colSpan={8} className="transition-all duration-300 ease-in-out">
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedRow === payment.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">Notes</div>
                      <div className="px-4 py-3.5 text-sm font-medium text-gray-900">{payment?.notes}</div>
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
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">Attachments</div>
                      <div className="px-4 py-3.5">
                        <Badge>{payment?.attachments}</Badge>
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
  );
};

export default RootTable;
