import React, { useEffect, useState } from "react";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import WrapSelect from "../component/base/WrapSelect";
import AccountDetails from "../component/modules/AccountDetails";
import InfoBox from "../component/base/InfoBox";
import CheckboxField from "../component/modules/CheckboxField";
import SmartDisburseIcon from "../assets/image/SMART-Disburse.svg";

const paymentMethodOptions = [
  { label: "ACH", value: "ach", description: "1–3 business days" },
  { label: "Wire", value: "wire", description: "Same business day" },
  {
    label: "SMART Disburse",
    value: "smart-disburse",
    iconImageSrc: SmartDisburseIcon,
    iconImageAlt: "SMART Disburse",
  },
];

const bankAccountOptions = [
  {
    label: "Bank AG ••••1728",
    value: "1728",
    description: "Main account",
    descriptionPosition: "below" as const,
  },
  {
    label: "Bank AG ••••1010",
    value: "1010",
    description: "Secondary account",
    descriptionPosition: "below" as const,
  },
];

interface PaymentMethodDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (vendorName: string, value: string, label: string) => void;
  paymentMethodLabel: string;
  paymentMethodValue?: string;
  vendorName?: string;
}

const PaymentMethodDetailsModal: React.FC<PaymentMethodDetailsModalProps> = ({
  open,
  onClose,
  onSave,
  paymentMethodValue = "ach",
  vendorName = "",
}) => {
  const [selectedMethodValue, setSelectedMethodValue] = useState(paymentMethodValue);
  const [selectedBank, setSelectedBank] = useState("");
  const [makeDefault, setMakeDefault] = useState(true);
  const [bankAccountError, setBankAccountError] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedMethodValue(paymentMethodValue);
      setBankAccountError(false);
    }
  }, [open, paymentMethodValue]);

  if (!open) return null;

  const isBank = selectedMethodValue === "ach" || selectedMethodValue === "wire";
  const variant = isBank ? "bank" : selectedMethodValue === "smart-disburse" ? "smart-disburse" : "bank";

  const handleSave = () => {
    if (isBank && !selectedBank) {
      setBankAccountError(true);
      return;
    }
    setBankAccountError(false);
    const methodOption = paymentMethodOptions.find((o) => o.value === selectedMethodValue);
    const methodLabel = methodOption?.label ?? selectedMethodValue;
    const bankOption = isBank && selectedBank
      ? bankAccountOptions.find((o) => o.value === selectedBank)
      : null;
    const displayLabel = bankOption
      ? `${methodLabel} • ${bankOption.label}`
      : methodLabel;
    onSave?.(vendorName, selectedMethodValue, displayLabel);
    onClose();
  };

  return (
    <LayoutModal>
      <WrapModal
        className="w-125"
        onClose={onClose}
        header={
          <div>Select Payment Method</div>
        }
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSave}>
              Save
            </Button>
          </div>
        }
      >
        <div className="grid w-full gap-4 p-6">
          <WrapSelect
            label="Method of Payment"
            placeholder="Select payment method"
            options={paymentMethodOptions}
            selectedValue={selectedMethodValue}
            onSelect={setSelectedMethodValue}
          />

          {isBank && (
            <WrapSelect
              placeholder="Select bank account"
              options={bankAccountOptions}
              selectedValue={selectedBank}
              onSelect={(value) => {
                setSelectedBank(value);
                setBankAccountError(false);
              }}
              showSelectedDescription={false}
              error={bankAccountError}
              errorMessage="Please select a bank account."
            />
          )}

          {isBank && (
            <>
              <AccountDetails variant={variant} />
              <InfoBox
                color="blue"
                icon="information-circle"
                title='If your Routing Number, Account Number or Address records (as registered under the bank account) are no longer accurate, please update the details in your ERP. Once your details are updated, please "Refresh" to reflect the changes.'
              />
            </>
          )}

          <CheckboxField
            title="Make default payment method"
            subtitle='Checking this means next time you make a payment it will be pre-selected. You can change it anytime in <a href="#" class="text-blue-600 font-medium">vendor profile</a>.'
            checked={makeDefault}
            onChange={(e) => setMakeDefault(e.target.checked)}
          />
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default PaymentMethodDetailsModal;
