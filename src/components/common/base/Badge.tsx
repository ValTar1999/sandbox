import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';
import { focusButton } from '../../config/commonStyles';
import { type TColors, type TSizes, classes as enumClasses } from '../../enums/Badge';
import type { TIconName, TIconVariant, TIconDirectionLR } from '../../enums/Icon';

type BadgeProps = {
  size?: TSizes;
  color?: TColors;
  rounded?: boolean;
  icon?: TIconName;
  iconVariant?: TIconVariant;
  iconDirection?: TIconDirectionLR;
  iconClickable?: boolean;
  className?: string; 
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const Badge: React.FC<BadgeProps> = ({
  size = 'lg',
  color = 'gray',
  rounded = false,
  icon,
  iconVariant,
  iconDirection = 'right',
  iconClickable,
  className,
  children,
}) => {
  const isIconDirectionMap = icon ? iconDirection : 'default';

  const rootClasses = clsx(
    'inline-flex items-center whitespace-nowrap font-medium',
    size === 'xs' ? 'py-0' : 'py-0.5',
    color !== 'custom' && `text-${color}-800 bg-${color}-100 ring-1 ring-${color}-200`,
    size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-[9.8px] leading-4',
    rounded ? 'rounded-full' : 'rounded',
    enumClasses[size]?.[isIconDirectionMap],
    className
  );

  const iconClasses = clsx(
    size === 'xs' ? 'w-[9.8px] h-[9.8px]' : 'w-3.5 h-3.5',
    `text-${color}-400`,
    !iconClickable && (iconDirection === 'right' ? (size === 'xs' ? 'ml-[1.4px]' : 'ml-1') : (size === 'xs' ? 'mr-[1.4px]' : 'mr-1'))
  );

  const iconButtonClasses = clsx(
    iconDirection === 'right' ? (size === 'xs' ? 'ml-[1.4px]' : 'ml-1') : (size === 'xs' ? 'mr-[1.4px]' : 'mr-1'),
    rounded ? 'rounded-full' : 'rounded-1px',
    focusButton()
  );

  const renderIcon = () => {
    if (!icon) return null;

    const iconElement = (
      <Icon 
        icon={icon} 
        variant={iconVariant} 
        className={iconClasses} 
      />
    );

    return iconClickable ? (
      <button className={iconButtonClasses}>
        {iconElement}
      </button>
    ) : iconElement;
  };

  return (
    <div className={rootClasses}>
      {iconDirection === 'right' && children}
      {renderIcon()}
      {iconDirection === 'left' && children}
    </div>
  );
};

export default Badge;
