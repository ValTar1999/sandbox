import React from "react";
import clsx from "clsx";

interface ExpandableTableRowProps {
  colSpan: number;
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper for expandable table row content with smooth grid-based animation.
 * Uses grid-template-rows (0fr → 1fr) for fluid height transition.
 */
const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({
  colSpan,
  isExpanded,
  children,
  className,
}) => (
  <tr className="border-b border-gray-200 last:border-b-0">
    <td colSpan={colSpan} className="p-0 align-top">
      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          className
        )}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </td>
  </tr>
);

export default ExpandableTableRow;
