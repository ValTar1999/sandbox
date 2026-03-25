import { useState } from 'react';
import clsx from 'clsx';
import Icon from '../base/Icon';

type AccordionProps = {
  title: string;
  className?: string;
  children: React.ReactNode;
};

export default function Accordion({ title, children, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="w-full flex justify-between items-center border-b border-gray-200 py-4 text-left transition cursor-pointer select-none"
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        <Icon 
          icon="chevron-down"
          className={clsx('h-5 w-5 text-gray-400 transition-transform duration-300', {
            'rotate-180': isOpen,
          })}
        />
      </div>

      <div
        className={clsx('transition-all duration-500 mt-6', {
          'max-h-0 overflow-hidden': !isOpen,
          'max-h-[500px]': isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
}
