import { clsx } from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";
import Icon from "../base/Icon";
import type { TIconName, TIconVariant, TIconDirectionLR } from "../../enums/Icon";

// Типы пропсов для компонента Input
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  type?: "text" | "password" | "email" | "number" | "tel" | "url"; // Типы ввода
  disabled?: boolean; // Признак того, что инпут отключен
  readOnly?: boolean; // Признак того, что инпут доступен только для чтения
  error?: boolean; // Признак ошибки
  rounded?: boolean; // Признак округленных углов
  icon?: TIconName; // Иконка, отображаемая в инпуте
  iconVariant?: TIconVariant; // Вариант иконки
  iconDirection?: TIconDirectionLR; // Направление иконки: слева или справа
  className?: string; // Дополнительные классы для стилизации
};

// Базовые классы для инпута
const baseInputClasses = "block w-full h-10 border-gray-300 text-base font-normal overflow-hidden";

// Классы для иконок в зависимости от их расположения
const iconClasses = {
  left: "pl-10", // Иконка слева
  right: "pr-10", // Иконка справа
};

// Классы состояния инпута
const stateClasses = {
  disabled: "!text-gray-500 bg-gray-50", // Состояние для отключенного инпута
  readOnly: "bg-gray-50", // Состояние для инпута только для чтения
  error: "pr-10 border-red-500 placeholder:text-red-300 text-red-900", // Состояние ошибки
  default: "text-gray-800 placeholder-gray-400", // Стандартное состояние инпута
};

// Основной компонент инпута
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text", // По умолчанию тип инпута - текст
      disabled,
      readOnly,
      error,
      rounded = true, // По умолчанию инпут с округлыми углами
      icon,
      iconVariant,
      iconDirection = "left", // По умолчанию иконка слева
      placeholder,
      className,
      ...props
    },
    ref // Реф для передачи в инпут
  ) => {
    // Классы для контейнера инпута
    const containerClasses = clsx(
      "relative shadow-sm flex", // Относительное позиционирование и флекс-выравнивание
      rounded && "rounded-md", // Округленные углы, если это требуется
      className // Дополнительные классы
    );

    // Классы для самого инпута
    const inputClasses = clsx(
      baseInputClasses,
      icon && iconClasses[iconDirection], // Добавляем отступ в зависимости от расположения иконки
      rounded && "rounded-md", // Если округленные углы, добавляем соответствующий класс
      disabled && stateClasses.disabled, // Применяем класс для отключенного инпута
      readOnly && stateClasses.readOnly, // Применяем класс для инпута только для чтения
      error && stateClasses.error, // Применяем класс для состояния ошибки
      !disabled && !readOnly && !error && stateClasses.default // Стандартное состояние
    );

    return (
      <div className={containerClasses}>
        {(icon || error) && (
          <div className="absolute inset-0 w-full px-3 pointer-events-none flex items-center">
            {/* Отображаем иконку или ошибку */}
            {icon ? (
              // Иконка в инпуте
              <Icon
                icon={icon}
                variant={iconVariant}
                className={clsx("text-gray-400", iconDirection === "right" && "ml-auto")}
              />
            ) : (
              // Иконка ошибки
              <Icon
                icon="exclamation-circle"
                variant="solid"
                className="ml-auto text-red-500"
              />
            )}
          </div>
        )}

        {/* Основной инпут */}
        <input
          ref={ref} // Передаем реф
          type={type} // Тип инпута
          disabled={disabled} // Признак отключения инпута
          readOnly={readOnly} // Признак доступности инпута только для чтения
          placeholder={placeholder} // Плейсхолдер
          className={inputClasses} // Применяем стили для инпута
          {...props} // Передаем остальные пропсы
        />
      </div>
    );
  }
);

// Устанавливаем displayName для отладки
Input.displayName = "Input";

// Экспортируем компонент
export default Input;
