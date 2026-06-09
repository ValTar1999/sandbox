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
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useClick,
  arrow as floatingArrow,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';

type TooltipContextType = ReturnType<typeof useTooltipInternal> & {
  arrowRef: React.MutableRefObject<SVGSVGElement | null>;
  hasArrow: boolean;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error('Tooltip components must be used within <Tooltip />');
  }
  return ctx;
};

const useTooltipInternal = (
  initialOpen = false,
  trigger: 'hover' | 'click' = 'hover',
  placement: Placement = 'top',
  hasArrow = false
) => {
  const [open, setOpen] = useState(initialOpen);
  const arrowRef = React.useRef<SVGSVGElement | null>(null);

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(hasArrow ? 10 : 6),
      flip(),
      shift({ padding: 8 }),
      ...(hasArrow
        ? [floatingArrow({ element: arrowRef, padding: 8 })]
        : []),
    ],
    placement,
  });

  const hover = useHover(floating.context, {
    move: false,
    delay: { open: 150, close: 100 },
  });
  const focus = useFocus(floating.context);
  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: 'tooltip' });

  const interactions = useInteractions(
    trigger === 'click' ? [click, dismiss, role] : [hover, focus, dismiss, role]
  );

  return {
    open,
    setOpen,
    arrowRef,
    hasArrow,
    ...floating,
    ...interactions,
  };
};

interface TooltipRootProps {
  initialOpen?: boolean;
  trigger?: 'hover' | 'click';
  placement?: Placement;
  arrow?: boolean;
}

export const Tooltip = ({
  children,
  initialOpen,
  trigger,
  placement,
  arrow = false,
}: PropsWithChildren<TooltipRootProps>) => {
  const value = useTooltipInternal(initialOpen, trigger, placement, arrow);

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
};

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'button' | 'span';
};

export const TooltipTrigger = ({
  children,
  as = 'span',
  className,
  ...props
}: PropsWithChildren<TooltipTriggerProps>) => {
  const { getReferenceProps, refs } = useTooltipContext();

  const Component = as === 'button' ? 'button' : 'span';
  const elementProps = as === 'button' ? { type: 'button' as const } : {};

  const referenceProps = getReferenceProps({
    ...props,
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

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  arrowClassName?: string;
}

const ARROW_STATIC_SIDE: Record<string, string> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export const TooltipContent = ({
  children,
  className,
  arrowClassName,
  style,
  ...props
}: PropsWithChildren<TooltipContentProps>) => {
  const {
    open,
    x,
    y,
    strategy,
    refs,
    getFloatingProps,
    hasArrow,
    arrowRef,
    middlewareData,
    placement,
  } = useTooltipContext();

  if (!open) return null;

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;
  const staticSide =
    ARROW_STATIC_SIDE[placement.split('-')[0]] ?? 'bottom';

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
          ...style,
        }}
        {...getFloatingProps({
          className: clsx(
            'relative z-50 rounded-md p-3 text-xs font-normal text-gray-50 shadow-dropdown',
            className
          ),
          ...props,
        })}
      >
        {children}
        {hasArrow ? (
          <svg
            ref={arrowRef}
            width="16"
            height="8"
            viewBox="0 0 16 8"
            className={clsx('absolute', arrowClassName)}
            style={{
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              [staticSide]: '-8px',
            }}
            aria-hidden
          >
            <path d="M0 0L8 8L16 0" />
          </svg>
        ) : null}
      </div>
    </FloatingPortal>
  );
};

export default Tooltip;

// Re-export hook for advanced usage (e.g. closing from inside content)
export { useTooltipContext };
