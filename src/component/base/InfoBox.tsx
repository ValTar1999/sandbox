import React from 'react';
import clsx from 'clsx';
import Icon from '../base/Icon';
import Button from '../base/Button';
import {TIconName, TIconVariant} from '../../enums/Icon'
import {TColors} from '../../enums/InfoBox';
import {TVariants} from '../../enums/Button';

type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  text?: string;
  line?: boolean;
  closeIcon?: boolean;
  closeIconVariant?: TVariants;
  color?: TColors;
};

type WithIcon = {
  icon: TIconName;
  iconVariant?: TIconVariant;
};

type WithoutIcon = {
  icon?: undefined;
  iconVariant?: never;
};

type InfoBoxProps = BaseProps & (WithIcon | WithoutIcon);

const InfoBox: React.FC<InfoBoxProps> = ({
  title = 'Lorem ipsum dolor',
  text,
  line = false,
  icon = 'x-circle',
  iconVariant,
  closeIcon = false,
  closeIconVariant = 'linkError',
  color = 'red',
  className,
  children,
  ...rest
}) => {
  const rootClass = clsx(
    'flex items-start justify-between gap-3 p-4',
    `bg-${color}-50 border-${color}-400`,
    line ? 'border-l-4 rounded-r-md' : 'rounded-md',
    className
  );

  const iconClass = clsx('mt-0.5', `text-${color}-400`);
  const titleClass = `text-${color}-800`;
  const textClass = `text-${color}-700`;

  return (
    <div className={rootClass} {...rest}>
      <div className="flex w-full gap-3">
        {icon && (
          <Icon
            icon={icon}
            variant={iconVariant}
            className={iconClass}
          />
        )}
        <div className="flex w-full flex-col justify-between lg:flex-row lg:items-start">
          <div className="space-y-1 text-sm font-medium lg:mr-10">
            <div className={titleClass}>{title}</div>
            {text && <div className={textClass}>{text}</div>}
          </div>
          <div className="mt-2 flex gap-1 lg:-mt-1">
            {children}
          </div>
        </div>
      </div>
      {closeIcon && (
        <Button
          variant={closeIconVariant}
          size="xs"
          className="-mr-2 -mt-2"
        >
          <Icon icon="x" />
        </Button>
      )}
    </div>
  );
};

export default InfoBox;
