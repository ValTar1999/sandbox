import React from 'react';
import clsx from 'clsx';
import CheckBox from '../base/CheckBox';

interface Props
  extends Omit<
    React.ComponentProps<typeof CheckBox>,
    'label' | 'labelClassName' | 'wrapperClassName'
  > {
  title?: string;
  text?: string;
  subtitle?: string;
  description?: string;
  labelClassName?: string;
}

const CheckboxField: React.FC<Props> = ({
  title,
  text,
  subtitle,
  description,
  className,
  labelClassName,
  children,
  ...props
}) => {
  const content = children ? (
    children
  ) : (
    <>
      {title && (
        <div
          className="font-medium text-gray-700"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {text && (
        <div
          className="text-gray-900"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {subtitle && (
        <div
          className="text-gray-500"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      )}
      {description && (
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </>
  );

  return (
    <CheckBox
      {...props}
      wrapperClassName={clsx('flex items-start cursor-pointer', className)}
      labelClassName={clsx('ml-3 text-sm text-start', labelClassName)}
      label={content}
    />
  );
};

export default CheckboxField;
