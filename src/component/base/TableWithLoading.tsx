import React from "react";
import clsx from "clsx";
import Loading from "./Loading";
import { LOADING_TRANSITION_CLASS } from "../../constants/animations";

interface TableWithLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const TableWithLoading: React.FC<TableWithLoadingProps> = ({
  isLoading,
  children,
}) => (
  <div className="relative min-h-fit">
    <div
      className={clsx(
        LOADING_TRANSITION_CLASS,
        isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      {children}
    </div>
    {isLoading && (
      <div className="flex justify-center items-center py-8 absolute inset-0">
        <Loading />
      </div>
    )}
  </div>
);

export default TableWithLoading;
