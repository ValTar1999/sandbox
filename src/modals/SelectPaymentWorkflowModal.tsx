import React, { useState, useEffect } from "react";
import clsx from "clsx";
import LayoutModal from "../component/modal/LayoutModal";
import WrapModal from "../component/modal/WrapModal";
import Button from "../component/base/Button";
import Badge from "../component/base/Badge";
import Icon from "../component/base/Icon";

export type PaymentWorkflowOption = {
  id: string;
  title: string;
  description: string;
  isDefault?: boolean;
};

const workflowOptions: PaymentWorkflowOption[] = [
  {
    id: "standard",
    title: "STANDARD SMART Collect",
    description:
      "Standard SMART Collect with all eligible payment methods being made available.",
    isDefault: true,
  },
  {
    id: "auto-insurance",
    title: "Auto Insurance Claimants",
    description: "Used for claims for all auto insurance contracts.",
  },
  {
    id: "premium",
    title: "Premium Collection",
    description: "Used for collecting customer insurance premiums.",
  },
];

interface SelectPaymentWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  selectedWorkflowId: string | null;
  onSave: (workflowId: string) => void;
}

const SelectPaymentWorkflowModal: React.FC<SelectPaymentWorkflowModalProps> = ({
  open,
  onClose,
  selectedWorkflowId,
  onSave,
}) => {
  const defaultWorkflowId =
    workflowOptions.find((o) => o.isDefault)?.id ?? "standard";
  const [tempSelected, setTempSelected] = useState<string>(
    selectedWorkflowId ?? defaultWorkflowId
  );

  useEffect(() => {
    if (open) {
      setTempSelected(selectedWorkflowId ?? defaultWorkflowId);
    }
  }, [open, selectedWorkflowId, defaultWorkflowId]);

  if (!open) return null;

  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <LayoutModal>
      <WrapModal
        className="w-[480px] max-w-full"
        onClose={onClose}
        header={
          <div className="text-lg font-semibold text-gray-900">
            Select Payment Workflow
          </div>
        }
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="lg" onClick={onClose}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSave}>
              Save
            </Button>
          </div>
        }
      >
        <div className="px-6 pt-4 pb-6 space-y-2">
          {workflowOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setTempSelected(option.id)}
              className={clsx(
                "w-full text-left p-4 rounded-lg border bg-white transition-all duration-300 cursor-pointer",
                tempSelected === option.id
                  ? "border-transparent ring-2 ring-blue-600"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm leading-5 text-gray-900">
                      {option.title}
                    </span>
                    {option.isDefault && (
                      <Badge color="blue" size="xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
                <div
                  className={clsx(
                    "w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-300",
                    tempSelected === option.id
                      ? "bg-blue-600"
                      : "border-2 border-gray-300 bg-white"
                  )}
                >
                  {tempSelected === option.id && (
                    <div className="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-white mt-px ml-px" />
                  )}
                </div>
              </div>
            </button>
          ))}

          <p className="text-sm leading-5 text-gray-500 pt-4">
            Manage your default &apos;Pay Another Way&apos; payment methods
            preferences in{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 cursor-pointer transition-colors duration-300"
            >
              Payment Workflows
              <Icon icon="arrow-right" className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </WrapModal>
    </LayoutModal>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { workflowOptions };
export default SelectPaymentWorkflowModal;
