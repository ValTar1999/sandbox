import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { focusButton } from '../../config/commonStyles';

// Тип пропсов для CheckBox: стандартные атрибуты input + кастомный флаг ошибки
type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

// Компонент CheckBox с поддержкой проброса ref (удобно для форм и валидации)
const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ error = false, type = 'checkbox', className, ...props }, ref) => {
    // Генерация списка классов с условием на type (checkbox/radio) и ошибку
    const checkboxClass = clsx(
      'h-4 w-4 text-smart-main-600 bg-white cursor-pointer', // базовые стили
      'hover:text-smart-main-darken',                        // эффект при наведении
      'disabled:bg-gray-100 disabled:text-blue-300 disabled:border-gray-200', // стили для disabled
      'disabled:checked:bg-current disabled:checked:border-current',           // стили для disabled + checked
      type === 'radio' ? 'rounded-full' : 'rounded',         // скругление в зависимости от типа
      error                                                  // цвет рамки при ошибке
        ? 'border-red-500 hover:border-red-600'
        : 'border-gray-300 hover:border-gray-400',
      focusButton(),                                         // фокус-эффекты из общей конфигурации
      className                                              // пользовательские классы
    );

    return (
      <input
        type={type}             // checkbox или radio
        className={checkboxClass} // собранные классы
        ref={ref}               // проброс рефа
        {...props}              // остальные атрибуты (checked, onChange и т.п.)
      />
    );
  }
);

// Имя компонента для удобства отладки в React DevTools
CheckBox.displayName = 'CheckBox';

export default CheckBox;
