import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface LayoutModalProps {
  open?: boolean;
  children: ReactNode;
}

const ANIMATION_MS = 300;

const LayoutModal: React.FC<LayoutModalProps> = ({ open = true, children }) => {
  const closeTimerRef = useRef<number | null>(null);
  const [isMounted, setIsMounted] = useState(open);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (open) {
      setIsMounted(true);
      setIsExiting(false);
      return;
    }

    setIsExiting(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false);
      setIsExiting(false);
      closeTimerRef.current = null;
    }, ANIMATION_MS);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  const timingStyle = {
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' as const,
  };

  if (typeof document === 'undefined' || !isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 overflow-y-auto p-4 ${
        !isExiting ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-gray-900/75 transition-opacity duration-300 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
        style={timingStyle}
        aria-hidden
      />

      <div className="relative flex min-h-full items-center justify-center py-8">
        <div
          className={`w-full max-w-full transition-opacity duration-300 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
          style={timingStyle}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LayoutModal;
