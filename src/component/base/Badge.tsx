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
    'inline-flex items-center py-0.5 whitespace-nowrap font-medium',
    color !== 'custom' && `text-${color}-800 bg-${color}-100 ring-inset ring-1 ring-${color}-200`,
    size === 'lg' ? 'text-sm' : 'text-xs',
    rounded ? 'rounded-full' : 'rounded',
    enumClasses[size]?.[isIconDirectionMap],
    className
  );

  const iconClasses = clsx(
    'w-3.5 h-3.5',
    `text-${color}-400`,
    !iconClickable && (iconDirection === 'right' ? 'ml-1' : 'mr-1')
  );

  const iconButtonClasses = clsx(
    iconDirection === 'right' ? 'ml-1' : 'mr-1',
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
