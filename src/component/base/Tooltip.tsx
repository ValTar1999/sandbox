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
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useClick,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";

type TooltipContextType = ReturnType<typeof useTooltipInternal>;

const TooltipContext = createContext<TooltipContextType | null>(null);

const useTooltipContext = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error("Tooltip components must be used within <Tooltip />");
  }
  return ctx;
};

const useTooltipInternal = (
  initialOpen = false,
  trigger: "hover" | "click" = "hover",
  placement: Placement = "top"
) => {
  const [open, setOpen] = useState(initialOpen);

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    placement,
  });

  const hover = useHover(floating.context, {
    move: false,
    delay: { open: 150, close: 100 },
  });
  const focus = useFocus(floating.context);
  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context);
  const role = useRole(floating.context, { role: "tooltip" });

  const interactions = useInteractions(
    trigger === "click"
      ? [click, dismiss, role]
      : [hover, focus, dismiss, role]
  );

  return {
    open,
    setOpen,
    ...floating,
    ...interactions,
  };
};

interface TooltipRootProps {
  initialOpen?: boolean;
  trigger?: "hover" | "click";
  placement?: Placement;
}

export const Tooltip = ({
  children,
  initialOpen,
  trigger,
  placement,
}: PropsWithChildren<TooltipRootProps>) => {
  const value = useTooltipInternal(initialOpen, trigger, placement);

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
};

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  as?: "button" | "span";
};

export const TooltipTrigger = ({
  children,
  as = "span",
  className,
  ...props
}: PropsWithChildren<TooltipTriggerProps>) => {
  const { getReferenceProps, refs } = useTooltipContext();

  const Component = as === "button" ? "button" : "span";
  const elementProps = as === "button" ? { type: "button" as const } : {};

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

interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TooltipContent = ({
  children,
  className,
  style,
  ...props
}: PropsWithChildren<TooltipContentProps>) => {
  const { open, x, y, strategy, refs, getFloatingProps } = useTooltipContext();

  if (!open) return null;

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
            "z-50 rounded-md px-2 py-1 text-xs font-normal text-gray-50 shadow-dropdown",
            className
          ),
          ...props,
        })}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

export default Tooltip;

// Re-export hook for advanced usage (e.g. closing from inside content)
export { useTooltipContext };
