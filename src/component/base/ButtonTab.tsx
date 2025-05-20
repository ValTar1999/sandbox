import React from 'react';
import clsx from 'clsx';
import Badge from './Badge';
import { focusButton } from '../../config/commonStyles';

interface ButtonTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: 'blue' | 'red';
  count?: string;
  active?: boolean;
}

const VARIANT_STYLES = {
  blue: 'text-blue-600 bg-blue-50',
  red: 'text-red-600 bg-red-50',
} as const;

const BASE_STYLES = 'inline-flex items-center px-3 py-2 rounded-md cursor-pointer';

export const ButtonTab: React.FC<ButtonTabProps> = ({
  title,
  variant = 'blue',
  className,
  disabled,
  count,
  active,
  children,
  ...props
}) => {
  const rootClass = clsx(
    BASE_STYLES,
    className,
    disabled
      ? 'text-gray-400'
      : active
        ? VARIANT_STYLES[variant]
        : 'text-gray-500',
    focusButton()
  );

  return (
    <button 
      className={rootClass} 
      disabled={disabled} 
      type="button"
      {...props}
    >
      <div className="text-sm font-medium">
        {title || children}
      </div>
      
      {!disabled && count && (
        <Badge
          size="sm"
          color={!active && variant !== 'red' ? 'gray' : variant}
          className="ml-2"
          rounded
        >
          {count}
        </Badge>
      )}
    </button>
  );
};
