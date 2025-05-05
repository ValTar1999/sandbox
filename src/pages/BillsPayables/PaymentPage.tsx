import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { payments } from "./data";
import Button from "../../component/base/Button";
import Badge from "../../component/base/Badge";
import Icon from "../../component/base/Icon";
import { RefreshButton } from "../../component/base/RefreshButton";
import Box from "../../component/layout/Box";
import Accordion from "../../component/dropdowns/Accordion";
import DropdownCalendar from "../../component/dropdowns/DropdownCalendar";

interface PayableSummaryItem {
  item: string;
  quantity: number;
  price: string;
  amount: string;
}

interface PaymentWithSummary {
  id: string;
  totalAmount: string;
  amountValute: string;
  billReference: string;
  payee: string;
  source: string;
  dueDate: string;
  status: string;
  notes: string;
  attachments: string;
  payableSummary: PayableSummaryItem[];
}

interface PaymentWithoutSummary {
  id: string;
  totalAmount: string;
  amountValute: string;
  billReference: string;
  payee: string;
  source: string;
  dueDate: string;
  status: string;
  notes: string;
  attachments: string;
}

function hasPayableSummary(payment: PaymentWithSummary | PaymentWithoutSummary): payment is PaymentWithSummary {
  return (payment as PaymentWithSummary).payableSummary !== undefined;
}

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const payment = payments.find(p => p.id === id);

  if (!payment) {
    return <div className="p-6 text-red-500">Payment not found</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(payment.billReference)
      .then(() => alert('Bill reference copied!'))
      .catch(() => alert('Failed to copy.'));
  };

  const handleBack = () => {
    navigate(-1);
  };


  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <Box
      className="max-w-7xl mx-auto"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button variant="add_on" icon="arrow-left" onClick={handleBack} ></Button>
            <span className="text-lg font-medium text-gray-900 ml-4">Initiate a Payment</span>
          </div>
          <RefreshButton/>
        </div>
      }
      footer={
        <div className="flex items-center gap-2 w-full justify-end">
          <Button size="md">Pay: {payment.totalAmount}</Button>
          <DropdownCalendar 
            dueDate={payment.dueDate} 
            onSelectDate={setSelectedDate} 
            selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} 
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
              <Button size="md">Pay: {payment.totalAmount}</Button>
              <DropdownCalendar 
                dueDate={payment.dueDate} 
                onSelectDate={setSelectedDate} 
                selectedIndex={selectedIndex} 
                setSelectedIndex={setSelectedIndex} 
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
                      setSelectedIndex(null); // Reset selection
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

          <hr className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">VENDOR</div>
            <span className="text-base font-gray-700">{payment.payee}</span>  
          </div>

          <hr className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Bill reference</div>
            <div className="flex items-center">
              <span className="text-base font-gray-700">{payment.billReference}</span>  
              <Button size="sm" variant="add_on" icon="clipboard-copy" onClick={handleCopy} />
            </div>
          </div>

          <hr className="flex h-auto w-px bg-gray-300" />

          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">Attachments</div>
            <Badge>{payment?.attachments}</Badge>
          </div>

        </div>

        <div className="mt-6">
          Selector
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
                <div className="mt-1 text-xs font-medium text-gray-400">Aug 29, 2023 10:40 AM (EST)</div>
              </div>
            </div>
          </Accordion>
        </div>

      </div>
    </Box>
  );
};

export default PaymentPage;
