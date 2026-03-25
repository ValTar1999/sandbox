import React, { ReactElement, Children, isValidElement } from 'react';
import { Dropdown } from '../dropdowns/Dropdown';
import clsx from 'clsx';

interface TooltipDarkProps {
  children: React.ReactNode;
  className?: string;
  menuClass?: string;
  onStateChange?: (isOpen: boolean) => void;
  [key: string]: unknown;
}

const TooltipDark = ({children, className, menuClass, onStateChange, ...props}: TooltipDarkProps): ReactElement => {
  let trigger: ReactElement | null = null;
  let menu: ReactElement | null = null;

  type SlotChildProps = { slot?: string };
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const slot = (child as React.ReactElement<SlotChildProps>).props.slot;
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
      {...props}
    />
  );
};

export default TooltipDark;