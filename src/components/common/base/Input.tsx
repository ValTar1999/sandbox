import React from 'react';
import clsx from 'clsx';
import Icon from '../base/Icon';
import { TIconName, TIconVariant, TIconDirectionLR } from '../../../enums/Icon';

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  rounded?: boolean;
  inputClass?: string;
  error?: boolean;
  icon?: TIconName;
  iconVariant?: TIconVariant;
  iconDirection?: TIconDirectionLR;
  clearable?: boolean;
  onClear?: () => void;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: {
    root: 'h-8',
    input: 'text-sm leading-5 py-1.5',
    iconWrap: 'px-2.5',
    icon: 'w-4 h-4',
    iconPaddingLeft: 'pl-9',
    iconPaddingRight: 'pr-9',
  },
  md: {
    root: 'h-10',
    input: 'text-base py-2',
    iconWrap: 'px-3',
    icon: 'w-5 h-5',
    iconPaddingLeft: 'pl-10',
    iconPaddingRight: 'pr-10',
  },
} as const;

const Input: React.FC<InputProps> = ({
  type = 'text',
  rounded = true,
  inputClass,
  error = false,
  icon,
  iconVariant,
  iconDirection = 'left',
  clearable = false,
  onClear,
  size = 'md',
  className,
  disabled,
  readOnly,
  value,
  ...attrs
}) => {
  const sizes = sizeClasses[size];
  const hasValue = String(value ?? '').length > 0;
  const showClear = clearable && hasValue && !disabled && !readOnly;

  const rootClasses = clsx(
    'relative shadow-sm flex',
    sizes.root,
    rounded && 'rounded-md',
    className
  );

  const iconWrapClasses = clsx(
    'absolute inset-0 w-full pointer-events-none flex items-center',
    sizes.iconWrap
  );

  const iconClasses = clsx(
    'text-gray-400',
    sizes.icon,
    iconDirection === 'right' && 'ml-auto'
  );

  const inputClasses = clsx(
    'transition duration-300 ease-in-out block w-full border font-normal placeholder-gray-400 overflow-hidden',
    sizes.input,
    icon && iconDirection === 'left' && sizes.iconPaddingLeft,
    icon && iconDirection === 'right' && sizes.iconPaddingRight,
    showClear && sizes.iconPaddingRight,
    !icon && !showClear && 'px-3',
    rounded && 'rounded-md',
    disabled && '!text-gray-500',
    (readOnly || disabled) && 'bg-gray-50',
    error
      ? 'border-red-500 pr-10 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
      : 'border-gray-300 text-gray-800 focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
    inputClass
  );

  return (
    <div className={rootClasses}>
      {(icon || error) && iconDirection !== 'right' && (
        <div className={iconWrapClasses}>
          {icon ? (
            <Icon icon={icon} variant={iconVariant} className={iconClasses} />
          ) : (
            <Icon
              icon="exclamation-circle"
              variant="solid"
              className="ml-auto text-red-500"
            />
          )}
        </div>
      )}
      {icon && iconDirection === 'right' && !error && (
        <div className={iconWrapClasses}>
          <Icon icon={icon} variant={iconVariant} className={iconClasses} />
        </div>
      )}
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          className={clsx(
            'absolute right-0 top-0 flex h-full items-center text-gray-400 transition-colors duration-300 hover:text-gray-500 cursor-pointer',
            sizes.iconWrap
          )}
          onClick={onClear}
        >
          <Icon icon="x" className={sizes.icon} />
        </button>
      )}
      <input
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        className={inputClasses}
        {...attrs}
      />
    </div>
  );
};

export default Input;
