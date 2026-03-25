import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';
import Icon from '../base/Icon';

interface AccordionProps {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  header,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxHeight, setMaxHeight] = useState<number | 'auto'>(defaultOpen ? 1000 : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      setMaxHeight(contentRef.current.scrollHeight);
    } else {
      setMaxHeight(0);
    }
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={clsx('w-full overflow-hidden', className)}>
      <div
        onClick={toggle}
        className={clsx(
          'w-full text-left focus:outline-none cursor-pointer py-4 border-t border-gray-200 first:border-0 hover:bg-gray-50 transition-all duration-300',
          { 'bg-gray-100': isOpen }
        )}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
        role="button"
      >
        <div className="flex items-center">
          <Icon
            icon="chevron-right"
            className={clsx(
              'transition-transform duration-300 text-gray-500 mr-6',
              isOpen && 'rotate-90'
            )}
            aria-hidden
          />
          <div className="flex-1">{header}</div>
        </div>
      </div>

      <div
        id="accordion-content"
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out mb-2 rounded-b-lg shadow"  
        style={{ maxHeight: maxHeight === 'auto' ? 'none' : `${maxHeight}px` }}
      >
        <div className="">{children}</div>
      </div>
    </div>
  );
};

