import { useState } from "react";
import { clsx } from "clsx";
import Icon from "./Icon";
import Button from "./Button";
import Badge from "./Badge";

interface Option {
  label: string;
  value: string;
  description?: string;
  descriptionPosition?: "inline" | "below";
  inactive?: boolean;
  badge?: string;
  rightLabel?: string;
  rightValue?: string;
  icon?: string;
  iconImageSrc?: string;
  iconImageAlt?: string;
  inactiveDescription?: string;
}

interface WrapSelectProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  footerActionLabel?: string;
  onFooterActionClick?: () => void;
  labelIcon?: string;
  showInactiveBadge?: boolean;
  showInactiveNotice?: boolean;
}

function WrapSelect({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = "Select option",
  footerActionLabel,
  onFooterActionClick,
  labelIcon,
  showInactiveBadge = true,
  showInactiveNotice = false,
}: WrapSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);
  const selectedDescriptionPosition = selectedOption?.descriptionPosition ?? "inline";
  const selectedDescription =
    selectedDescriptionPosition === "below"
      ? selectedOption?.description?.trim()?.slice(-8)
      : selectedOption?.description;

  return (
    <div className="relative">
      <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        {labelIcon && (
          <Icon icon={labelIcon} className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "w-full px-3 py-2 border rounded-md text-left shadow-ыь bg-white flex items-center justify-between cursor-pointer",
          open ? "ring ring-blue-600 border-blue-600" : "border-gray-300"
        )}
      >
        {selectedOption ? (
          <div className="flex items-center gap-2">
            {selectedOption.rightValue ? (
              <Icon icon="library" className="w-5 h-5 text-gray-400" />
            ) : selectedOption.iconImageSrc ? (
              <img
                src={selectedOption.iconImageSrc}
                alt={selectedOption.iconImageAlt ?? selectedOption.label}
                className="w-4 h-4"
                loading="lazy"
                decoding="async"
              />
            ) : selectedOption.icon ? (
              <Icon icon={selectedOption.icon} className="w-5 h-5 text-gray-400" />
            ) : null}
            <div className="min-w-0 truncate font-medium text-gray-900 text-base">
              {selectedOption.label}
            </div>
            {selectedDescription && (
              <div className="min-w-0 truncate text-base font-medium text-gray-900">
                {selectedDescription}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-base">{placeholder}</span>
        )}
        <Icon
          icon="selector"
          className="w-5 h-5 text-gray-400"
        />
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-0.5 bg-white border border-gray-100 divide-y divide-gray-200 rounded-md shadow-lg overflow-hidden">
          {options.map((option) => (
            <li
              key={option.value}
              className={clsx(
                "p-4",
                option.inactive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer",
                selectedValue === option.value && "bg-blue-50"
              )}
              onClick={() => {
                if (!option.inactive) {
                  onSelect(option.value);
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {option.rightValue ? (
                    <Icon
                      icon="library"
                      className={clsx(
                        "w-5 h-5 mt-0.5",
                        option.inactive ? "text-gray-400" : "text-gray-500"
                      )}
                    />
                  ) : option.iconImageSrc ? (
                    <img
                      src={option.iconImageSrc}
                      alt={option.iconImageAlt ?? option.label}
                      className="w-4 h-4 mt-0.5"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : option.icon ? (
                    <Icon icon={option.icon} className="w-5 h-5 text-gray-500 mt-0.5" />
                  ) : null}
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div 
                        className={clsx(
                          "font-medium text-sm leading-5 truncate",
                          option.inactive ? "text-gray-500" : "text-gray-900"
                        )}
                      >
                        {option.label}
                      </div>
                      {option.description && (option.descriptionPosition ?? "inline") === "inline" && (
                        <span 
                          className={clsx(
                            "text-sm font-normal leading-5 truncate",
                            option.inactive ? "text-gray-500" : "text-gray-500"
                          )}
                        >
                          {option.description}
                        </span>
                      )}
                      {showInactiveBadge && option.inactive && (
                        <div className="text-xs font-medium text-gray-800 leading-4 bg-gray-200 px-2 border border-gray-200 rounded-full">
                          Not available
                        </div>
                      )}
                    </div>
                    {option.description && (option.descriptionPosition ?? "inline") === "below" && (
                      <div className="text-sm text-gray-500">{option.description}</div>
                    )}
                  </div>
                </div>
                {option.rightValue && (
                  <div className="text-right">
                    <div 
                      className={clsx(
                        "text-sm leading-5",
                        option.inactive ? "text-gray-400" : "text-gray-900"
                      )}
                    >
                      Balance
                    </div>
                    <div 
                      className={clsx(
                        "text-sm font-medium leading-5",
                        option.inactive ? "text-gray-500" : "text-gray-900"
                      )}
                    >
                      {option.rightValue}
                    </div>
                  </div>
                )}
                {option.badge && (
                  <Badge color="blue" rounded>{option.badge}</Badge>
                )}
              </div>
              {option.inactive && option.inactiveDescription && (
                <div className="mt-2 text-sm text-gray-500">
                  {option.inactiveDescription}
                </div>
              )}
              {showInactiveNotice && option.inactive && (
                <a 
                  href=""
                  className="flex items-center gap-3 rounded-md bg-yellow-50 p-4 border border-yellow-200 mt-3"
                >
                  <Icon icon="exclamation" className="w-4 h-4 text-yellow-500" />
                  <div className="text-medium text-sm leading-5 text-yellow-700">
                    This bank account is inactive. <span className="font-semibold">Click here</span> to resolve this issue.
                  </div>
                </a>
              )}
            </li>
          ))}
          {footerActionLabel && (
            <li className="px-4 py-3 flex justify-center">
              <Button
                variant="linkPrimary"
                iconDirection="left"
                size="md"
                icon="plus"
                onClick={() => {
                  onFooterActionClick?.();
                  setOpen(false);
                }}
              >
                {footerActionLabel}
              </Button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default WrapSelect;
