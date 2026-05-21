import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from 'react';
import clsx from 'clsx';
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
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';

type MenuContextType = ReturnType<typeof useMenuInternal> & {
  arrowRef: React.MutableRefObject<SVGSVGElement | null>;
};

const MenuContext = createContext<MenuContextType | null>(null);

export const useMenuContext = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error('Menu components must be used within <Menu.Root />');
  }
  return ctx;
};

const useMenuInternal = (
  initialOpen = false,
  placement: Placement = 'bottom-start'
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
  const role = useRole(floating.context, { role: 'menu' });

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

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined | null)[]
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((r) => {
      if (!r) return;
      if (typeof r === 'function') {
        r(value);
      } else {
        (r as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function getReactElementRef<T>(
  element: React.ReactElement
): React.Ref<T> | undefined {
  const legacy = element as unknown as { ref?: React.Ref<T> };
  if (legacy.ref) return legacy.ref;
  const propsRef = (
    element.props as unknown as {
      ref?: React.Ref<T>;
    }
  ).ref;
  return propsRef;
}

type MenuTriggerProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'button' | 'span';
  asChild?: boolean;
};

const Trigger = ({
  children,
  className,
  onClick,
  as = 'button',
  asChild = false,
  ...props
}: MenuTriggerProps) => {
  const { refs, getReferenceProps, open, setOpen } = useMenuContext();

  const referenceProps = getReferenceProps({
    ...props,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      setOpen(!open);
    },
  }) as React.HTMLAttributes<HTMLElement> & {
    ref?: React.Ref<HTMLElement>;
  };

  if (asChild) {
    if (!React.isValidElement(children)) {
      throw new Error(
        'Menu.Trigger with asChild expects a single React element child.'
      );
    }

    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
    >;

    const {
      ref: referenceRef,
      className: referenceClassName,
      ...restReferenceProps
    } = referenceProps;

    const mergedClassName = clsx(
      className,
      child.props.className,
      referenceClassName
    );

    return React.cloneElement(child, {
      ...child.props,
      ...restReferenceProps,
      ref: mergeRefs(
        refs.setReference,
        referenceRef as React.Ref<HTMLElement | null> | undefined,
        getReactElementRef<HTMLElement | null>(child)
      ),
      className: mergedClassName,
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        child.props.onClick?.(event);
        referenceProps.onClick?.(event);
      },
    } as Partial<React.HTMLAttributes<HTMLElement>>);
  }

  const Component = as === 'span' ? 'span' : 'button';
  const elementProps = as === 'button' ? { type: 'button' as const } : {};

  const {
    ref: referenceRefCallback,
    className: referenceClassName,
    ...restReferenceProps
  } = referenceProps;

  const mergedClassName = clsx(className, referenceClassName);

  return (
    <Component
      ref={mergeRefs(refs.setReference, referenceRefCallback)}
      {...elementProps}
      {...restReferenceProps}
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
        className: clsx('text-sm text-gray-900', className),
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
        'flex w-full items-center px-3 py-1.5 text-left text-sm text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors duration-300',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={clsx('my-1 h-px bg-gray-200', className)} />
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
