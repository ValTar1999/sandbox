import React from 'react';
import clsx from 'clsx';
import Badge from './Badge';
import { focusButton } from '../../config/commonStyles';

// Интерфейс пропсов для ButtonTab
interface ButtonTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string; // Текст вкладки
  variant?: 'blue' | 'red'; // Цветовая схема
  count?: string; // Значение бейджа
  active?: boolean; // Состояние активной вкладки
}

// Классы для различных вариантов цвета
const VARIANT_STYLES = {
  blue: 'text-blue-600 bg-blue-50',
  red: 'text-red-600 bg-red-50',
} as const;

// Базовые стили кнопки
const BASE_STYLES = 'inline-flex items-center px-3 py-2 rounded-md cursor-pointer';

// Компонент вкладки-кнопки
export const ButtonTab: React.FC<ButtonTabProps> = ({
  title,
  variant = 'blue',
  className,
  disabled,
  count,
  active,
  children,
  ...props
}) => {
  // Генерация классов на основе состояний
  const rootClass = clsx(
    BASE_STYLES,
    className,
    disabled
      ? 'text-gray-400' // если отключена
      : active
        ? VARIANT_STYLES[variant] // если активна — применяется цвет
        : 'text-gray-500', // если неактивна
    focusButton() // стили фокуса
  );

  return (
    <button 
      className={rootClass} 
      disabled={disabled} 
      type="button"
      {...props}
    >
      <div className="text-sm font-medium">
        {title || children} {/* если передан title — рендерим его, иначе children */}
      </div>
      
      {/* Отображение бейджа только если count передан и кнопка не disabled */}
      {!disabled && count && (
        <Badge
          size="sm"
          color={!active && variant !== 'red' ? 'gray' : variant} // если неактивен и не красный — серый бейдж
          className="ml-2"
          rounded
        >
          {count}
        </Badge>
      )}
    </button>
  );
};
