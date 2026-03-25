import React, { forwardRef } from 'react';
import clsx from 'clsx';

type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
};

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  (
    {
      error = false,
      type = 'checkbox',
      className,
      label,
      labelClassName,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const isRadio = type === 'radio';
    const checkboxClass = clsx(
      'h-4 w-4 min-w-4 cursor-pointer bg-white flex items-center justify-center overflow-visible',
      'border border-gray-300',
      isRadio
        ? 'peer-checked:border-blue-600 peer-checked:bg-blue-600'
        : 'peer-checked:bg-blue-600 peer-checked:border-blue-600',
      'peer-disabled:bg-gray-100 peer-disabled:border-gray-200 peer-disabled:cursor-not-allowed',
      isRadio ? 'rounded-full' : 'rounded-sm',
      error && 'border-red-500 peer-checked:border-red-500',
      'peer-focus:outline peer-focus:outline-2 peer-focus:outline-blue-600 peer-focus:outline-offset-2',
      className
    );

    return (
      <label
        className={clsx('inline-flex items-center overflow-visible', wrapperClassName)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
          }
        }}
      >
        <input
          type={type}
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <span
          className={clsx(
            checkboxClass,
            isRadio ? 'peer-checked:[&>svg]:opacity-100' : 'peer-checked:[&>svg]:opacity-100'
          )}
        >
          {isRadio ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              className="text-white opacity-0"
            >
              <circle cx="3" cy="3" r="3" fill="currentColor" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="7"
              viewBox="0 0 9 7"
              className="mx-auto block text-white opacity-0"
            >
              <path
                d="M8.69471 0.292787C8.88218 0.480314 8.9875 0.734622 8.9875 0.999786C8.9875 1.26495 8.88218 1.51926 8.69471 1.70679L3.69471 6.70679C3.50718 6.89426 3.25288 6.99957 2.98771 6.99957C2.72255 6.99957 2.46824 6.89426 2.28071 6.70679L0.280712 4.70679C0.0985537 4.51818 -0.00224062 4.26558 3.78026e-05 4.00339C0.00231622 3.74119 0.107485 3.49038 0.292893 3.30497C0.478301 3.11956 0.729114 3.01439 0.99131 3.01211C1.25351 3.00983 1.50611 3.11063 1.69471 3.29279L2.98771 4.58579L7.28071 0.292787C7.46824 0.105316 7.72255 0 7.98771 0C8.25288 0 8.50718 0.105316 8.69471 0.292787Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
        {label && (
          <span className={clsx('text-sm text-start', labelClassName)}>
            {label}
          </span>
        )}
      </label>
    );
  }
);


export default CheckBox;
