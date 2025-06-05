import { useState } from "react";
import { clsx } from "clsx";

interface Option {
  label: string;
  value: string;
  description?: string;
  inactive?: boolean;
}

interface WrapSelectProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

function WrapSelect({
  label,
  options,
  selectedValue,
  onSelect,
}: WrapSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className="relative">
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "w-full px-4 py-2 border rounded-md text-left bg-white shadow-sm",
          open && "ring-2 ring-blue-500"
        )}
      >
        {selectedOption ? (
          <div>
            <div className="font-semibold">{selectedOption.label}</div>
            {selectedOption.description && (
              <div className="text-sm text-gray-500">
                {selectedOption.description}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Select option</span>
        )}
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={clsx(
                "px-4 py-2 cursor-pointer",
                option.inactive ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100",
                selectedValue === option.value && "bg-blue-50 font-semibold"
              )}
              onClick={() => {
                if (!option.inactive) {
                  onSelect(option.value);
                  setOpen(false);
                }
              }}
            >
              <div>{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500">{option.description}</div>
              )}
              {option.inactive && (
                <div className="text-xs text-orange-500 mt-1">
                  Not available
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WrapSelect;
