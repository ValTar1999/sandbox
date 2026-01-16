import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { payments, Payment } from "./BillsPayables/data";
import Button from "../component/base/Button";
import Badge from "../component/base/Badge";
import Icon from "../component/base/Icon";
import { RefreshButton } from "../component/base/RefreshButton";
import Box from "../component/layout/Box";
import Accordion from "../component/dropdowns/Accordion";
import DropdownCalendar from "../component/dropdowns/DropdownCalendar";
import WrapSelect from "../component/base/WrapSelect";
import SmartDisburseIcon from "../assets/image/SMART-Disburse.svg";
// import InfoBox from '../component/base/InfoBox';
import VendorsToPay from '../component/dropdowns/VendorsToPay';

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
  
  const payment = useMemo(() => payments.find(p => p.id === id), [id]);

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

  // Pay Modal
  const handlePayClick = (payment: typeof payments[0]) => {
    setSelectedPayment(payment);
    setIsPayModalOpen(true);
  };

  const handlePayConfirm = () => {
    console.log('Processing payment:', selectedPayment);
    setIsPayModalOpen(false);
    setIsPaymentSubmittedModalOpen(true);
  };

  const handlePayClose = () => {
    setIsPayModalOpen(false);
    setSelectedPayment(null);
  };
  // --------------------------------------------------

  // Payment Submitted Modal
  const handlePaymentSubmittedConfirm = () => {
    console.log('Cancelling payment:', selectedPayment);
    setIsPaymentSubmittedModalOpen(false);
    setSelectedPayment(null);
  };

  const handlePaymentSubmittedClose = () => {
    setIsPaymentSubmittedModalOpen(false);
    setSelectedPayment(null);
  };
  // --------------------------------------------------

  // Choose Data Modal
  const handleChooseDataClick = (payment: typeof payments[0]) => {
    setSelectedPayment(payment);
    setIsChooseDataModalOpen(true);
  };

  const handleChooseDataModalConfirm = () => {
    console.log('Processing payment:', selectedPayment);
    setIsChooseDataModalOpen(false);
    setSelectedPayment(null);
  };

  const handleChooseDataModalClose = () => {
    setIsChooseDataModalOpen(false);
    setSelectedPayment(null);
  };
  // --------------------------------------------------


  // WrapSelect
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
                onSelect={setSelectedAccount}
                footerActionLabel="Add New Bank Account"
                showInactiveBadge={false}
                showInactiveNotice
              />
            </div>
            {/* <InfoBox
              title='Insufficient Funds'
              text="Your selected bank account does not have enough funds to complete this payable with the sum of $(2,553.68) USD or the balance for the bank account cannot be checked. You can choose a different bank account or you'll need to ensure sufficient funds when the check payment clears."
              color="yellow"
              icon="exclamation"
            >
            </InfoBox> */}
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
                onSelect={setSelectedMethod}
              />
            </div>
            {/* <InfoBox
              title='If your Routing Number, Account Number or Address records (as registered under the bank account) are no longer accurate, please update the details in your ERP. Once your details are updated, please "Refresh" to reflect the changes.'
              color="blue"
              icon="information-circle"
            >
            </InfoBox> */}
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
            <VendorsToPay/>
          )}
        </div>
        
        <div className="">
          <PayModal
            open={isPayModalOpen}
            onClose={handlePayClose}
            onConfirm={handlePayConfirm}
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
