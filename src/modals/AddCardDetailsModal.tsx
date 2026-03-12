import React, { useState } from "react";
import clsx from "clsx";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import Input from "../component/base/Input";
import Icon from "../component/base/Icon";
import WrapSelect from "../component/base/WrapSelect";

export type CardDetailsFormData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  nameOnCard: string;
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

interface AddCardDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CardDetailsFormData) => void;
}

const AddCardDetailsModal: React.FC<AddCardDetailsModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formData, setFormData] = useState<CardDetailsFormData>({
    cardNumber: "",
    expiry: "",
    cvc: "",
    nameOnCard: "",
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
      cardNumber: "",
      expiry: "",
      cvc: "",
      nameOnCard: "",
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
    formData.cardNumber.trim() !== "" &&
    formData.expiry.replace(/\D/g, "").length >= 4 &&
    formData.cvc.trim() !== "";

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

  const updateField = <K extends keyof CardDetailsFormData>(
    field: K,
    value: CardDetailsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showError = (field: keyof CardDetailsFormData) =>
    touched &&
    typeof formData[field] === "string" &&
    formData[field].trim() === "";

  return (
    <LayoutModal>
      <WrapModal
        className="w-[480px] max-w-full"
        onClose={handleClose}
        header={<div>Add Credit Card Details</div>}
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
              Card Number
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={formData.cardNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                const formatted = digits
                  .replace(/(\d{4})(?=\d)/g, "$1 ")
                  .trim();
                updateField("cardNumber", formatted);
              }}
              error={showError("cardNumber")}
              icon="credit-card"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry
              </label>
              <Input
                placeholder="MM / YY"
                value={formData.expiry}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    digits.length > 2
                      ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
                      : digits;
                  updateField("expiry", formatted);
                }}
                error={showError("expiry")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="CVC"
                value={formData.cvc}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 3);
                  updateField("cvc", v);
                }}
                error={showError("cvc")}
              />
            </div>
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
                    Name on Card
                  </label>
                  <Input
                    placeholder="Full Name"
                    value={formData.nameOnCard}
                    onChange={(e) =>
                      updateField("nameOnCard", e.target.value)
                    }
                  />
                </div>
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

export default AddCardDetailsModal;
