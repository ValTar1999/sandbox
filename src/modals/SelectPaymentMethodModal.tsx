import React, { useState } from "react";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import WrapSelect from "../component/base/WrapSelect";
import SmartDisburseIcon from "../assets/image/SMART-Disburse.svg";

const unavailableMessage =
  "Payment method is not available for this bank account. Please select another bank account or contact support for more information.";

const paymentMethodOptions = [
  { label: "ACH", value: "ach", description: "1–3 business days" },
  { label: "Wire", value: "wire", description: "Same business day" },
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
    inactiveDescription: unavailableMessage,
  },
  {
    label: "Check",
    value: "check",
    inactive: true,
    inactiveDescription: unavailableMessage,
  },
  {
    label: "SMART Exchange",
    value: "smart",
    inactive: true,
    inactiveDescription: unavailableMessage,
  },
];

interface SelectPaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: (value: string, label: string) => void;
}

const SelectPaymentMethodModal: React.FC<SelectPaymentMethodModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    const option = paymentMethodOptions.find((o) => o.value === selectedValue);
    onConfirm?.(selectedValue, option?.label ?? selectedValue);
    onClose();
  };

  return (
    <LayoutModal>
      <WrapModal
        className="w-128 flex flex-col"
        header={
          <div>Select Payment Method</div>
        }
        onClose={onClose}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleConfirm} disabled={!selectedValue}>
              Save
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <WrapSelect
            label="Method of Payment"
            placeholder="Select payment method"
            options={paymentMethodOptions}
            selectedValue={selectedValue}
            onSelect={setSelectedValue}
            showInactiveBadge
          />
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default SelectPaymentMethodModal;
