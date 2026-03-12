import React from "react";
import clsx from "clsx";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => (
  <div className={clsx("relative rounded-full", className)}>
    <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
    <div className="absolute inset-0 rounded-full border-2 border-t-blue-600 border-transparent animate-spin" />
  </div>
);

export default Spinner;
