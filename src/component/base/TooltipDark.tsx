import React, { ReactElement, Children, isValidElement } from 'react';
import { Dropdown } from '../dropdowns/Dropdown';
import clsx from 'clsx';

interface TooltipDarkProps {
  children: React.ReactNode;
  className?: string;
  menuClass?: string;
  onStateChange?: (isOpen: boolean) => void;
  [key: string]: any; // поддержка data-* атрибутов
}

export const TooltipDark = ({
  children,
  className,
  menuClass,
  onStateChange,
  ...rest
}: TooltipDarkProps): JSX.Element => {
  let trigger: ReactElement | null = null;
  let menu: ReactElement | null = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const slot = (child.props as any).slot; // 👈 приводим props к типу any
      if (slot === 'trigger') {
        trigger = child;
      } else {
        menu = child;
      }
    }
  });

  return (
    <Dropdown
      trigger={trigger}
      menu={menu}
      className={className}
      menuClass={clsx(
        'rounded-md bg-gray-900 text-sm font-normal text-gray-50 shadow-dropdown',
        menuClass
      )}
      onStateChange={onStateChange}
      {...rest}
    />
  );
};
