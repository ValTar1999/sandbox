import React from "react";
import clsx from "clsx";
import Icon from "./Icon";
import Spinner from "./Spinner";
import type { TIconName } from "../../../enums/Icon";

export type ButtonGroupVariant =
  | "gray"
  | "blue"
  | "blueFilled"
  | "yellow"
  | "red"
  | "white";

interface ButtonGroupProps {
  label: string;
  icon?: TIconName;
  iconImageSrc?: string;
  iconImageAlt?: string;
  variant?: ButtonGroupVariant;
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_STYLES: Record<
  ButtonGroupVariant,
  { root: string; main: string; mainText: string; mainIcon: string; dropdown: string; dropdownIcon: string }
> = {
  gray: {
    root: "",
    main: "bg-gray-100",
    mainText: "text-gray-700",
    mainIcon: "text-gray-500",
    dropdown: "bg-gray-100 border-l border-gray-200",
    dropdownIcon: "text-gray-500",
  },
  blue: {
    root: "border border-gray-300 bg-white",
    main: "bg-white",
    mainText: "text-blue-700",
    mainIcon: "text-blue-600",
    dropdown: "bg-white border-l border-gray-300",
    dropdownIcon: "text-gray-600",
  },
  blueFilled: {
    root: "border border-gray-300 bg-white",
    main: "bg-white",
    mainText: "text-green-700",
    mainIcon: "text-green-600",
    dropdown: "bg-white border-l border-gray-300",
    dropdownIcon: "text-gray-600",
  },
  yellow: {
    root: "",
    main: "bg-amber-100",
    mainText: "text-amber-800",
    mainIcon: "text-amber-600",
    dropdown: "bg-amber-100 border-l border-amber-200",
    dropdownIcon: "text-amber-700",
  },
  red: {
    root: "",
    main: "bg-gray-100",
    mainText: "text-red-600",
    mainIcon: "text-red-500",
    dropdown: "bg-gray-100 border-l border-gray-200",
    dropdownIcon: "text-gray-500",
  },
  white: {
    root: "",
    main: "bg-white",
    mainText: "text-gray-900",
    mainIcon: "text-gray-600",
    dropdown: "bg-white border-l border-gray-200",
    dropdownIcon: "text-gray-500",
  },
};

const SIZE_STYLES = {
  sm: {
    root: "text-xs rounded-md",
    main: "px-2 py-1 gap-1.5",
    icon: "w-3.5 h-3.5",
    dropdown: "pl-2 pr-1.5",
  },
  md: {
    root: "text-sm rounded-lg font-medium",
    main: "px-3 py-2 gap-2",
    icon: "w-4 h-4",
    dropdown: "pl-3 pr-2.5",
  },
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  label,
  icon,
  iconImageSrc,
  iconImageAlt,
  variant = "gray",
  size = "md",
  className,
}) => {
  const styles = VARIANT_STYLES[variant];
  const sizeStyles = SIZE_STYLES[size];

  const showSpinner = icon === "in-progress";

  return (
    <div
      className={clsx(
        "inline-flex items-center font-medium cursor-pointer hover:opacity-90 transition-opacity",
        styles.root,
        sizeStyles.root,
        className
      )}
    >
      <div
        className={clsx(
          "inline-flex items-center",
          styles.main,
          styles.mainText,
          sizeStyles.main
        )}
      >
        {iconImageSrc ? (
          <img
            src={iconImageSrc}
            alt={iconImageAlt ?? label}
            className={clsx(sizeStyles.icon, "flex-shrink-0")}
          />
        ) : showSpinner ? (
          <Spinner
            className={clsx(sizeStyles.icon, "flex-shrink-0", styles.mainIcon)}
          />
        ) : icon ? (
          <Icon
            icon={icon}
            className={clsx(sizeStyles.icon, "flex-shrink-0", styles.mainIcon)}
          />
        ) : null}
        <span>{label}</span>
      </div>
      <div
        className={clsx(
          "inline-flex items-center",
          styles.dropdown,
          sizeStyles.dropdown
        )}
      >
        <Icon
          icon="chevron-down"
          className={clsx(sizeStyles.icon, styles.dropdownIcon)}
        />
      </div>
    </div>
  );
};

export default ButtonGroup;
