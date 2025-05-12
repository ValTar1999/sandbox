import React from 'react';
import clsx from 'clsx';
import Icon from '../base/Icon';
import { TIconName, TIconVariant, TIconDirectionLR } from '../../enums/Icon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rounded?: boolean;
  inputClass?: string;
  error?: boolean;
  icon?: TIconName;
  iconVariant?: TIconVariant;
  iconDirection?: TIconDirectionLR;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  rounded = true,
  inputClass,
  error = false,
  icon,
  iconVariant,
  iconDirection = 'left',
  className,
  disabled,
  readOnly,
  ...attrs
}) => {
  // Составляем классы для разных частей компонента
  const rootClasses = clsx(
    'relative shadow-sm flex h-8', 
    rounded && 'rounded-md', 
    className
  );

  const iconWrapClasses = clsx(
    'absolute inset-0 w-full px-3 pointer-events-none flex items-center'
  );

  const iconClasses = clsx(
    'text-gray-400', 
    iconDirection === 'right' && 'ml-auto'
  );

  const inputClasses = clsx(
    'transition duration-300 ease-in-out block w-full border border-gray-300 text-base font-normal text-gray-800 placeholder-gray-400 overflow-hidden focus:border-smart-main focus:outline-none focus:ring-1 focus:ring-smart-main',
    'pl-3',
    icon && iconDirection === 'left' && 'pl-10',
    icon && iconDirection === 'right' && 'pr-10',
    rounded && 'rounded-md',
    disabled ? '!text-gray-500' : 'text-gray-800',
    (readOnly || disabled) && 'bg-gray-50',
    error && 'pr-10 border-red-500 placeholder:text-red-300 text-red-900',
    inputClass
  );

  return (
    <div className={rootClasses}>
      {(icon || error) && (
        <div className={iconWrapClasses}>
          {icon ? (
            <Icon
              icon={icon}
              variant={iconVariant}
              className={iconClasses}
            />
          ) : (
            <Icon
              icon="exclamation-circle"
              variant="solid"
              className="ml-auto text-red-500"
            />
          )}
        </div>
      )}
      <input
        type={type}
        disabled={disabled}
        readOnly={readOnly}
        className={inputClasses}
        {...attrs}
      />
    </div>
  );
};

export default Input;
