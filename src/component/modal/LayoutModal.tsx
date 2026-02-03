import React, { ReactNode, useEffect, useState } from "react";

interface LayoutModalProps {
  children: ReactNode;
}

const LayoutModal: React.FC<LayoutModalProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 bg-gray-900/75">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <div className="relative flex min-h-full items-center justify-center py-8">
        <div
          className={`w-full max-w-full transition-all duration-300 ease-in-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutModal;
