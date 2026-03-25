import React, { ReactNode, useEffect, useState } from "react";

interface LayoutModalProps {
  children: ReactNode;
}

const LayoutModal: React.FC<LayoutModalProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const timingStyle = {
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" as const,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4">
      <div
        className={`absolute inset-0 bg-gray-900/75 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={timingStyle}
        aria-hidden
      />

      <div className="relative flex min-h-full items-center justify-center py-8">
        <div
          className={`w-full max-w-full transition-all duration-300 ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2"
          }`}
          style={timingStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutModal;
