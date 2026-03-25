import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import clsx from "clsx";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow as floatingArrow,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";

type MenuContextType = ReturnType<typeof useMenuInternal> & {
  arrowRef: React.MutableRefObject<SVGSVGElement | null>;
};

const MenuContext = createContext<MenuContextType | null>(null);

export const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("Menu components must be used within <Menu.Root />");
  }
  return ctx;
};

const useMenuInternal = (
  initialOpen = false,
  placement: Placement = "bottom-start"
) => {
  const [open, setOpen] = useState(initialOpen);
  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      floatingArrow({ element: arrowRef, padding: 8 }),
    ],
  });

  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: "menu" });

  const interactions = useInteractions([dismiss, role]);

  return {
    open,
    setOpen,
    arrowRef,
    ...floating,
    ...interactions,
  };
};

interface MenuRootProps {
  initialOpen?: boolean;
  placement?: Placement;
}

const Root = ({
  children,
  initialOpen,
  placement,
}: PropsWithChildren<MenuRootProps>) => {
  const value = useMenuInternal(initialOpen, placement);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

type MenuTriggerProps = React.HTMLAttributes<HTMLElement> & {
  as?: "button" | "span";
};

const Trigger = ({ children, className, onClick, as = "button", ...props }: MenuTriggerProps) => {
  const { refs, getReferenceProps, open, setOpen } = useMenuContext();

  const Component = as === "span" ? "span" : "button";
  const elementProps = as === "button" ? { type: "button" as const } : {};

  const referenceProps = getReferenceProps({
    ...props,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      setOpen(!open);
    },
  });

  const mergedClassName = clsx(
    className,
    (referenceProps as React.HTMLAttributes<HTMLElement>).className
  );

  return (
    <Component
      ref={refs.setReference}
      {...elementProps}
      {...referenceProps}
      className={mergedClassName}
    >
      {children}
    </Component>
  );
};

const Portal = ({ children }: PropsWithChildren) => {
  return <FloatingPortal>{children}</FloatingPortal>;
};

type PositionerProps = React.HTMLAttributes<HTMLDivElement> & {
  sideOffset?: number;
};

const Positioner = ({
  children,
  className,
  sideOffset = 0,
  style,
  ...props
}: PropsWithChildren<PositionerProps>) => {
  const { open, x, y, strategy, refs } = useMenuContext();

  if (!open) return null;

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: (y ?? 0) + sideOffset,
        left: x ?? 0,
        ...style,
      }}
      className={clsx(className)}
      {...props}
    >
      {children}
    </div>
  );
};

type PopupProps = React.HTMLAttributes<HTMLDivElement>;

const Popup = ({ children, className, ...props }: PopupProps) => {
  const { getFloatingProps } = useMenuContext();

  return (
    <div
      {...getFloatingProps({
        className: clsx("text-sm text-gray-900", className),
        ...props,
      })}
    >
      {children}
    </div>
  );
};

type ArrowProps = React.SVGAttributes<SVGSVGElement>;

const Arrow = ({ className, children, ...props }: ArrowProps) => {
  const { arrowRef } = useMenuContext();

  return (
    <svg
      ref={arrowRef}
      width="16"
      height="8"
      viewBox="0 0 16 8"
      className={className}
      {...props}
    >
      <path d="M0 8L8 0L16 8H0Z" />
      {children}
    </svg>
  );
};

type ItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Item = ({ children, className, ...props }: ItemProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex w-full items-center px-3 py-1.5 text-left text-sm text-gray-900 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={clsx("my-1 h-px bg-gray-200", className)} />
);

export const Menu = {
  Root,
  Trigger,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Item,
  Separator,
};

export default Menu;

