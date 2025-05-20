import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { focusButton } from '../../config/commonStyles';

type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ error = false, type = 'checkbox', className, ...props }, ref) => {
    const checkboxClass = clsx(
      'h-4 w-4 text-smart-main-600 bg-white cursor-pointer', 
      'hover:text-smart-main-darken',                        
      'disabled:bg-gray-100 disabled:text-blue-300 disabled:border-gray-200',
      'disabled:checked:bg-current disabled:checked:border-current',          
      type === 'radio' ? 'rounded-full' : 'rounded',         
      error                                                  
        ? 'border-red-500 hover:border-red-600'
        : 'border-gray-300 hover:border-gray-400',
      focusButton(),                                         
      className                                             
    );

    return (
      <input
        type={type}             
        className={checkboxClass}
        ref={ref}           
        {...props}              
      />
    );
  }
);


export default CheckBox;
