import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../component/base/Button";
import Badge from "../../component/base/Badge";
import Box from "../../component/layout/Box";
import { RefreshButton } from "../../component/base/RefreshButton";
import VendorsToPay from "../../component/dropdowns/VendorsToPay";
import { Payment } from "../BillsPayables/data";

interface MultiPartyPaymentPageProps {
  payment: Payment;
}

const MultiPartyPaymentPage: React.FC<MultiPartyPaymentPageProps> = ({ payment }) => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <Box
      className="max-w-7xl mx-auto"
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button variant="add_on" icon="arrow-left" onClick={handleBack} />
            <span className="text-lg font-medium text-gray-900 ml-4">
              Multi-Party Payment
            </span>
          </div>
          <RefreshButton />
        </div>
      }
      footer={
        <div className="flex items-center gap-2 w-full justify-end">
          <Button size="md">Pay: {payment.totalAmount}</Button>
        </div>
      }
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">{payment.totalAmount}</span>{" "}
                <span className="text-gray-500">{payment.amountValute}</span>
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
          </div>
        </div>

        <div className="flex flex-wrap gap-6 border-y border-gray-200 py-5">
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              Due date
            </div>
            <span className="text-base text-gray-700">{payment.dueDate}</span>
          </div>
          <div className="flex h-auto w-px bg-gray-300" />
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              Payee
            </div>
            <span className="text-base text-gray-700">{payment.payee}</span>
          </div>
          <div className="flex h-auto w-px bg-gray-300" />
          <div className="font-medium">
            <div className="text-xs uppercase text-gray-500 mb-1 tracking-wider">
              Bill reference
            </div>
            <span className="text-base text-gray-700">{payment.billReference}</span>
          </div>
        </div>

        <div className="pt-6">
          <VendorsToPay payment={payment} />
        </div>
      </div>
    </Box>
  );
};

export default MultiPartyPaymentPage;
