import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';

export type AlertVariant = 'yellow' | 'blue';

const VARIANT_STYLES: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    iconName: string;
  }
> = {
  yellow: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    iconName: 'exclamation',
  },
  blue: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    iconName: 'information-circle',
  },
};

export interface AlertProps {
  variant?: AlertVariant;
  icon?: string;
  iconVariant?: 'solid' | 'outline' | 'bicolor' | 'mini';
  title: string;
  description: string;
  /** Slot for action buttons/links (any layout or handlers). */
  actions?: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'yellow',
  icon,
  iconVariant = 'solid',
  title,
  description,
  actions,
  className,
}) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      className={clsx(
        'flex flex-wrap items-center justify-between gap-4 rounded-md border p-4',
        styles.container,
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Icon
          icon={icon ?? styles.iconName}
          variant={iconVariant}
          className={clsx('mt-1 h-5 w-5 shrink-0', styles.icon)}
        />
        <div className="flex items-start justify-between w-full">
          <div className="text-sm space-y-2 leading-5">
            <div className="font-medium text-gray-900">{title}</div>
            <p className=" text-gray-600">{description}</p>
          </div>

          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Alert;
