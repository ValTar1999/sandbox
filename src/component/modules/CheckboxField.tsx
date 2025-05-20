import React from 'react';
import clsx from 'clsx';

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  title?: string;
  text?: string;
  subtitle?: string;
  description?: string;
}

const CheckboxField: React.FC<Props> = ({
  title,
  text,
  subtitle,
  description,
  className,
  children,
  ...props
}) => {
  return (
    <label
      className={clsx('flex items-start cursor-pointer', className)}
      {...props}
    >
      <input type="checkbox" className="mt-0.5" />
      <div className="ml-3 text-sm text-start">
        {children ? (
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
        )}
      </div>
    </label>
  );
};

export default CheckboxField;
