import React, { ReactNode, useEffect, useState } from 'react';

interface LayoutModalProps {
  children: ReactNode;
}

const LayoutModal: React.FC<LayoutModalProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className={`absolute inset-0 bg-gray-900/75 transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      <div 
        className={`relative transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutModal;
