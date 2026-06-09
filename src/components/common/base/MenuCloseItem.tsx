import type { ComponentProps } from 'react';
import Menu, { useMenuContext } from './Menu';

const MenuCloseItem = ({
  children,
  ...props
}: ComponentProps<typeof Menu.Item>) => {
  const { setOpen } = useMenuContext();

  return (
    <Menu.Item
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
    >
      {children}
    </Menu.Item>
  );
};

export default MenuCloseItem;
