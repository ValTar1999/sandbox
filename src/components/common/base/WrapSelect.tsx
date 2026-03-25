import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { clsx } from "clsx";
import Icon from "./Icon";
import Button from "./Button";
import Badge from "./Badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip";
import type { TColors, TSizes } from "../../../enums/Badge";

interface Option {
  label: string;
  value: string;
  description?: string;
  descriptionPosition?: "inline" | "below";
  inactive?: boolean;
  badge?: string;
  badgeTooltip?: string;
  badgeColor?: TColors;
  badgeIcon?: string;
  badgeIconDirection?: "left" | "right";
  badgePosition?: "inline" | "right";
  badgeSize?: TSizes;
  badgeSecondary?: string;
  badgeSecondaryColor?: TColors;
  badgeSecondaryTooltip?: React.ReactNode;
  badgeRounded?: boolean;
  badgeSecondaryRounded?: boolean;
  rightLabel?: string;
  rightValue?: string;
  icon?: string;
  iconImageSrc?: string;
  iconImageAlt?: string;
  iconImageClassName?: string;
  inactiveDescription?: string;
}

interface WrapSelectProps {
  label?: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  footerActionLabel?: string;
  onFooterActionClick?: () => void;
  labelIcon?: string;
  hideLabel?: boolean;
  dropdownClassName?: string;
  showInactiveBadge?: boolean;
  showInactiveNotice?: boolean;
  showSelectedDescription?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** In trigger: "all" = show all badges, "defaultOnly" = only badgeSecondary (e.g. Default) */
  triggerBadgeMode?: "all" | "defaultOnly";
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
  hideLabel = false,
  dropdownClassName,
  showInactiveBadge = true,
  showInactiveNotice = false,
  showSelectedDescription = true,
  error = false,
  errorMessage = "Method of Payment is required.",
  triggerBadgeMode = "all",
}: WrapSelectProps) {
  const [open, setOpen] = useState(false);
  const selectId = useId();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail !== selectId) {
        setOpen(false);
      }
    };

    window.addEventListener("wrapselect:open", handler as EventListener);
    return () => window.removeEventListener("wrapselect:open", handler as EventListener);
  }, [selectId]);

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selectedValue),
    [options, selectedValue]
  );
  const selectedDescription = useMemo(() => {
    const description = selectedOption?.description;
    if (!description) return undefined;
    const position = selectedOption?.descriptionPosition ?? "inline";
    return position === "below" ? description.trim().slice(-8) : description;
  }, [selectedOption]);

  const renderOptionIcon = useCallback((option: Option, className?: string) => {
    if (option.iconImageSrc) {
      return (
        <img
          src={option.iconImageSrc}
          alt={option.iconImageAlt ?? option.label}
          className={option.iconImageClassName ?? className}
          loading="lazy"
          decoding="async"
        />
      );
    }

    if (option.icon) {
      return <Icon icon={option.icon} className={className} />;
    }

    if (option.rightValue) {
      return <Icon icon="library" className={className} />;
    }

    return null;
  }, []);

  const handleToggleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(
          new CustomEvent("wrapselect:open", { detail: selectId })
        );
      }
      return next;
    });
  }, [selectId]);

  return (
    <div className="relative">
      {!hideLabel && label && (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          {labelIcon && (
            <Icon icon={labelIcon} className="w-4 h-4 text-gray-400" />
          )}
        </div>
      )}
      <button
        onClick={handleToggleOpen}
        aria-label={hideLabel ? label : undefined}
        className={clsx(
          "w-full px-3 py-2 border rounded-md text-left shadow-sm bg-white flex items-center justify-between cursor-pointer",
          error
            ? "border-red-300 text-red-500"
            : open
              ? "ring ring-blue-600 border-blue-600"
              : "border-gray-300"
        )}
      >
        {selectedOption ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {renderOptionIcon(
              selectedOption,
              selectedOption.iconImageSrc ? "w-4 h-4 flex-shrink-0" : "w-5 h-5 text-gray-400 flex-shrink-0"
            )}
            <div className="min-w-0 truncate font-medium text-gray-900 text-base">
              {selectedOption.label}
            </div>
            {showSelectedDescription && selectedDescription && (
              <div className="min-w-0 truncate text-base font-medium text-gray-500">
                {selectedDescription}
              </div>
            )}
            {(triggerBadgeMode === "defaultOnly"
              ? selectedOption.badgeSecondary
              : (selectedOption.badge || selectedOption.badgeSecondary)) && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {selectedOption.badge && triggerBadgeMode !== "defaultOnly" && (selectedOption.badgeTooltip ? (
                  <Tooltip trigger="hover" placement="top">
                    <TooltipTrigger as="span" className="inline-flex cursor-help">
                      <Badge
                        color={selectedOption.badgeColor ?? "blue"}
                        size={selectedOption.badgeSize ?? "sm"}
                        rounded={selectedOption.badgeRounded !== false}
                        icon={selectedOption.badgeIcon}
                        iconDirection={selectedOption.badgeIconDirection}
                      >
                        {selectedOption.badge}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white max-w-[240px]">
                      {selectedOption.badgeTooltip}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge
                    color={selectedOption.badgeColor ?? "blue"}
                    size={selectedOption.badgeSize ?? "sm"}
                    rounded
                    icon={selectedOption.badgeIcon}
                    iconDirection={selectedOption.badgeIconDirection}
                  >
                    {selectedOption.badge}
                  </Badge>
                ))}
                {selectedOption.badgeSecondary && (selectedOption.badgeSecondaryTooltip ? (
                  <Tooltip trigger="hover" placement="top">
                    <TooltipTrigger as="span" className="inline-flex cursor-help">
                      <Badge
                        color={selectedOption.badgeSecondaryColor ?? "gray"}
                        size={selectedOption.badgeSize ?? "sm"}
                        rounded={selectedOption.badgeSecondaryRounded !== false}
                      >
                        {selectedOption.badgeSecondary}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white w-[343px] p-3 rounded-lg">
                      {selectedOption.badgeSecondaryTooltip}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Badge
                    color={selectedOption.badgeSecondaryColor ?? "gray"}
                    size={selectedOption.badgeSize ?? "sm"}
                    rounded={selectedOption.badgeSecondaryRounded !== false}
                  >
                    {selectedOption.badgeSecondary}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <span
            className={clsx(
              "text-base",
              error ? "text-red-400" : "text-gray-400"
            )}
          >
            {placeholder}
          </span>
        )}
        {error ? (
          <Icon icon="exclamation-circle" className="w-5 h-5 text-red-500" />
        ) : (
          <Icon icon="selector" className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {error && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}

      {open && (
        <ul
          className={clsx(
            "absolute z-10 mt-0.5 bg-white border border-gray-100 divide-y divide-gray-200 rounded-md shadow-lg overflow-hidden max-h-[350px] overflow-y-auto",
            dropdownClassName ?? "w-full"
          )}
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={clsx(
                "p-4",
                option.inactive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50 cursor-pointer",
                selectedValue === option.value && "bg-gray-100"
              )}
              onClick={() => {
                if (!option.inactive) {
                  onSelect(option.value);
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {renderOptionIcon(
                    option,
                    clsx(
                      option.iconImageSrc ? "w-4 h-4 mt-0.5" : "w-5 h-5 mt-0.5",
                      option.inactive ? "text-gray-400" : "text-gray-500"
                    )
                  )}
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <div 
                          className={clsx(
                            "font-medium text-sm leading-5 truncate",
                            option.inactive ? "text-gray-500" : "text-gray-900"
                          )}
                        >
                          {option.label}
                        </div>
                        {(option.badge || option.badgeSecondary) && (option.badgePosition ?? "right") === "inline" && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {option.badge && (option.badgeTooltip ? (
                              <Tooltip trigger="hover" placement="top">
                                <TooltipTrigger as="span" className="inline-flex cursor-help">
                                  <Badge size={option.badgeSize ?? "sm"} color={option.badgeColor ?? "gray"} rounded={option.badgeRounded !== false} icon={option.badgeIcon} iconDirection={option.badgeIconDirection}>
                                    {option.badge}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white max-w-[240px]">{option.badgeTooltip}</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Badge size={option.badgeSize ?? "sm"} color={option.badgeColor ?? "gray"} rounded={option.badgeRounded !== false} icon={option.badgeIcon} iconDirection={option.badgeIconDirection}>
                                {option.badge}
                              </Badge>
                            ))}
                            {option.badgeSecondary && (option.badgeSecondaryTooltip ? (
                              <Tooltip trigger="hover" placement="top">
                                <TooltipTrigger as="span" className="inline-flex cursor-help">
                                  <Badge size={option.badgeSize ?? "sm"} color={option.badgeSecondaryColor ?? "gray"} rounded={option.badgeSecondaryRounded !== false}>
                                    {option.badgeSecondary}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white w-[343px] px-3 py-2.5 rounded-lg">{option.badgeSecondaryTooltip}</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Badge size={option.badgeSize ?? "sm"} color={option.badgeSecondaryColor ?? "gray"} rounded={option.badgeSecondaryRounded !== false}>
                                {option.badgeSecondary}
                              </Badge>
                            ))}
                          </div>
                        )}
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
                {(option.badge || option.badgeSecondary) && (option.badgePosition ?? "right") !== "inline" && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.badge && (option.badgeTooltip ? (
                      <Tooltip trigger="hover" placement="top">
                        <TooltipTrigger as="span" className="inline-flex cursor-help">
                          <Badge color={option.badgeColor ?? "blue"} size={option.badgeSize ?? "sm"} rounded={option.badgeRounded !== false} icon={option.badgeIcon} iconDirection={option.badgeIconDirection}>
                            {option.badge}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white max-w-[240px]">{option.badgeTooltip}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge color={option.badgeColor ?? "blue"} size={option.badgeSize ?? "sm"} rounded={option.badgeRounded !== false} icon={option.badgeIcon} iconDirection={option.badgeIconDirection}>
                        {option.badge}
                      </Badge>
                    ))}
                    {option.badgeSecondary && (option.badgeSecondaryTooltip ? (
                      <Tooltip trigger="hover" placement="top">
                        <TooltipTrigger as="span" className="inline-flex cursor-help">
                          <Badge color={option.badgeSecondaryColor ?? "gray"} size={option.badgeSize ?? "sm"} rounded={option.badgeSecondaryRounded !== false}>
                            {option.badgeSecondary}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-white w-[343px] px-3 py-2.5 rounded-lg">{option.badgeSecondaryTooltip}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge color={option.badgeSecondaryColor ?? "gray"} size={option.badgeSize ?? "sm"} rounded={option.badgeSecondaryRounded !== false}>
                        {option.badgeSecondary}
                      </Badge>
                    ))}
                  </div>
                )}
                {selectedValue === option.value && (
                  <Icon icon="check" className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
              {option.inactive && option.inactiveDescription && (
                <div className="mt-2 text-sm text-gray-500">
                  {option.inactiveDescription}
                </div>
              )}
              {showInactiveNotice && option.inactive && (
                <a 
                  href="#"
                  onClick={(e) => e.preventDefault()}
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
                size="sm"
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
