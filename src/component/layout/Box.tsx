import React, { memo } from 'react';
import clsx from 'clsx';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Box = memo<BoxProps>(({ 
  header, 
  footer, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'relative w-full rounded-lg border border-gray-200 shadow shadow-inherit bg-white',
        className
      )}
      {...props}
    >
      {header && (
        <div className="flex border-b border-gray-200 px-6 py-5">
          {header}
        </div>
      )}
      
      {children}

      {footer && (
        <div className="flex border-t border-gray-200 p-6">
          {footer}
        </div>
      )}
    </div>
  );
});

export default Box;