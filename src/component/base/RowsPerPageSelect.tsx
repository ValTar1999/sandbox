import React from "react";
import clsx from "clsx";
import Icon from "./Icon";

interface RowsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  label?: string;
  className?: string;
}

const RowsPerPageSelect: React.FC<RowsPerPageSelectProps> = ({
  value,
  onChange,
  options = [10, 25, 50],
  label = "Rows per Page:",
  className,
}) => {
  return (
    <div className={clsx("flex items-center text-sm text-gray-700", className)}>
      <span className="text-gray-700">{label}</span>
      <div className="relative ml-2">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={clsx(
            "appearance-none rounded border border-gray-200 bg-white px-3 py-2 pr-8",
            "text-sm text-gray-900 outline-none",
            "hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          )}
          aria-label={label}
        >
          {options.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        <Icon
          icon="chevron-down"
          className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
};

export default RowsPerPageSelect;
