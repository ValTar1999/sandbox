import React from 'react';
import Icon from './Icon';
import { classes, sizes, TVariants } from '../../enums/Button';
import { TIconName, TIconVariant, TIconDirectionLR } from '../../enums/Icon';
import { TCommonSizes } from '../../enums/Sizes';

interface ButtonProps {
  size?: TCommonSizes;
  variant?: TVariants;
  title?: string;
  icon?: TIconName;
  iconVariant?: TIconVariant;
  iconDirection?: TIconDirectionLR;
  iconClass?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  as?: React.ElementType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  as: Tag = 'button',
  icon,
  iconVariant,
  iconClass,
  iconDirection = 'only',
  size = 'lg',
  variant = 'primary',
  className,
  disabled,
  children,
  onClick,
  ...props
}) => {
  const iconDirectionResolved = iconDirection !== 'only' ? iconDirection : (children ? 'right' : 'only');
  const isIconDirectionMap = iconDirectionResolved === 'only' ? 'only' : 'default';

  const classConstructor = {
    root: [
      classes.common,
      classes.colors[variant],
      sizes.buttonSize[isIconDirectionMap][size],
      sizes.rounded[size],
      disabled && classes.disabled,
      className,
    ].filter(Boolean).join(' '),
    icon: [
      classes.colorsIcon[variant],
      sizes.iconSize[isIconDirectionMap][size],
      isIconDirectionMap === 'default' && sizes.iconMargin[iconDirectionResolved as 'left' | 'right'][size],
      iconClass,
    ].filter(Boolean).join(' '),
  };

  return (
    <Tag className={classConstructor.root} disabled={disabled} onClick={onClick} {...props}>
      {iconDirectionResolved === 'right' && children}
      {icon && (
        <Icon
          icon={icon}
          variant={iconVariant}
          className={classConstructor.icon}
        />
      )}
      {iconDirectionResolved === 'left' && children}
    </Tag>
  );
};

export default Button;
