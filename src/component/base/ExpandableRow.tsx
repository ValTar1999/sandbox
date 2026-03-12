import React from "react";
import clsx from "clsx";

/** Section row with label + content, used in expandable table content (Notes, Status, etc.) */
export interface ExpandableRowProps {
  label: string;
  children: React.ReactNode;
  borderTop?: boolean;
}

const ExpandableRow: React.FC<ExpandableRowProps> = ({
  label,
  children,
  borderTop,
}) => (
  <div
    className={clsx("flex items-start", borderTop && "border-t border-gray-200")}
  >
    <div className="p-4 w-40 flex-shrink-0 text-xs font-semibold uppercase text-gray-500">
      {label}
    </div>
    <div className="px-4 py-3.5 flex-1">{children}</div>
  </div>
);

export default ExpandableRow;
