import React from 'react';
import clsx from 'clsx';

interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'sm',
  className,
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: {
      track: 'h-5 w-8',
      thumb: 'h-4 w-4',
      translate: checked ? 'translate-x-[13px]' : 'translate-x-px',
    },
    md: {
      track: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: checked ? 'translate-x-5' : 'translate-x-0.5',
    },
    lg: {
      track: 'h-7 w-14',
      thumb: 'h-6 w-6',
      translate: checked ? 'translate-x-7' : 'translate-x-0.5',
    },
  };

  const sizeConfig = sizeClasses[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onChange?.(!checked);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        'relative inline-flex flex-shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer',
        sizeConfig.track,
        checked ? 'bg-blue-600' : 'bg-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          'pointer-events-none inline-block rounded-full bg-white ring-0 transition duration-200',
          sizeConfig.thumb,
          sizeConfig.translate
        )}
      />
    </button>
  );
};

export default Toggle;
