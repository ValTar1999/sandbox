import React, { useState } from "react";
import clsx from "clsx";
import LayoutModal from "../components/common/modal/LayoutModal";
import WrapModal from "../components/common/modal/WrapModal";
import Button from "../components/common/base/Button";
import Input from "../components/common/base/Input";
import Icon from "../components/common/base/Icon";
import WrapSelect from "../components/common/base/WrapSelect";

export type BankAccountFormData = {
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  state: string;
};

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
];

interface AddBankAccountModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: BankAccountFormData) => void;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formData, setFormData] = useState<BankAccountFormData>({
    accountName: "",
    routingNumber: "",
    accountNumber: "",
    country: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    zipCode: "",
    state: "",
  });

  if (!open) return null;

  const resetForm = () => {
    setFormData({
      accountName: "",
      routingNumber: "",
      accountNumber: "",
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipCode: "",
      state: "",
    });
    setTouched(false);
  };

  const requiredFieldsValid =
    formData.accountName.trim() !== "" &&
    formData.routingNumber.trim() !== "" &&
    formData.accountNumber.trim() !== "";

  const handleAdd = () => {
    setTouched(true);
    if (!requiredFieldsValid) return;
    onAdd(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = <K extends keyof BankAccountFormData>(
    field: K,
    value: BankAccountFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showError = (field: keyof BankAccountFormData) =>
    touched && typeof formData[field] === "string" && formData[field].trim() === "";

  return (
    <LayoutModal>
      <WrapModal
        className="w-[480px] max-w-full"
        onClose={handleClose}
        header={<div>Add Bank Account Details</div>}
        footer={
          <div className="grid grid-cols-2 gap-3 items-center">
            <Button variant="secondary" size="lg" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleAdd}>
              Add
            </Button>
          </div>
        }
      >
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <Input
              placeholder="Account Name"
              value={formData.accountName}
              onChange={(e) => updateField("accountName", e.target.value)}
              error={showError("accountName")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routing Number
            </label>
            <Input
              type="number"
              placeholder="000-0000-000"
              value={formData.routingNumber}
              onChange={(e) => updateField("routingNumber", e.target.value)}
              error={showError("routingNumber")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <Input
              type="number"
              placeholder="0000-0000-0000"
              value={formData.accountNumber}
              onChange={(e) => updateField("accountNumber", e.target.value)}
              error={showError("accountNumber")}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <button
              type="button"
              className="flex w-full items-center justify-between cursor-pointer"
              onClick={() => setMoreInfoOpen(!moreInfoOpen)}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="chevron-down"
                  className={clsx(
                    "h-5 w-5 text-blue-600 transition-transform duration-200",
                    moreInfoOpen && "rotate-180"
                  )}
                />
                <span className="text-base font-semibold text-blue-600">
                  More Info
                </span>
              </div>
              <span className="text-sm leading-5 text-gray-400">Optional</span>
            </button>
            <div
              className={clsx(
                "overflow-hidden transition-all duration-200",
                moreInfoOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <WrapSelect
                    placeholder="Select Country"
                    options={countryOptions}
                    selectedValue={formData.country}
                    onSelect={(v) => updateField("country", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <Input
                    placeholder="Address Line 1"
                    value={formData.addressLine1}
                    onChange={(e) =>
                      updateField("addressLine1", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <Input
                    placeholder="Address Line 2"
                    value={formData.addressLine2}
                    onChange={(e) =>
                      updateField("addressLine2", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <Input
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        updateField("zipCode", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) =>
                        updateField("state", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

export default AddBankAccountModal;
