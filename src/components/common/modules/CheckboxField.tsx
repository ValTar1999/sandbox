import React from 'react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
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
  const safeTitle =
    title && typeof window !== 'undefined' ? DOMPurify.sanitize(title) : title;
  const safeText =
    text && typeof window !== 'undefined' ? DOMPurify.sanitize(text) : text;
  const safeSubtitle =
    subtitle && typeof window !== 'undefined'
      ? DOMPurify.sanitize(subtitle)
      : subtitle;
  const safeDescription =
    description && typeof window !== 'undefined'
      ? DOMPurify.sanitize(description)
      : description;

  const content = children ? (
    children
  ) : (
    <>
      {safeTitle && (
        <div
          className="font-medium text-gray-700"
          dangerouslySetInnerHTML={{ __html: safeTitle }}
        />
      )}
      {safeText && (
        <div
          className="text-gray-900"
          dangerouslySetInnerHTML={{ __html: safeText }}
        />
      )}
      {safeSubtitle && (
        <div
          className="text-gray-500"
          dangerouslySetInnerHTML={{ __html: safeSubtitle }}
        />
      )}
      {safeDescription && (
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: safeDescription }}
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
