import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';
import { classes as enumClasses, sizes as enumSizes, type TVariants } from '../../enums/Button';
import { type TIconName, TIconVariant, TIconDirectionLR } from '../../enums/Icon';
import { type TCommonSizes } from '../../enums/Sizes';

// Интерфейс для основных пропсов кнопки
interface ButtonBaseProps {
  as?: React.ElementType; // Тег, который будет использоваться для рендера (по умолчанию 'button')
  size?: TCommonSizes; // Размер кнопки: sm, md, lg и т.д.
  variant?: TVariants; // Вариант стиля: primary, secondary и т.п.
  title?: string; // Подсказка при наведении (title)
  icon?: TIconName; // Иконка, если она есть
  iconVariant?: TIconVariant; // Вариант отображения иконки
  iconDirection?: TIconDirectionLR; // Направление иконки: left, right или only (только иконка)
  iconClass?: string; // Дополнительный класс для иконки
  disabled?: boolean; // Отключена ли кнопка
  className?: string; // Дополнительный класс для кнопки
  children?: React.ReactNode; // Контент внутри кнопки
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Обработчик клика
}

// Финальный тип пропсов для компонента Button
type ButtonProps = ButtonBaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

// Компонент Button с поддержкой ref
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  as: Tag = 'button', // Компонент, который будет использоваться как корневой (по умолчанию <button>)
  size = 'lg', // Размер по умолчанию
  variant = 'primary', // Вариант по умолчанию
  icon,
  iconVariant,
  iconDirection = 'only',
  iconClass,
  disabled,
  className,
  children,
  ...props
}, ref) => {
  // Флаг, определяющий, отображается ли только иконка
  const isIconOnly = icon && iconDirection === 'only';

  // Проверяем, корректное ли направление иконки
  const hasValidIconDirection = iconDirection === 'left' || iconDirection === 'right';

  // Собираем классы для кнопки
  const buttonClasses = clsx(
    enumClasses.common, // Общие стили
    enumClasses.colors[variant], // Цветовая схема
    enumSizes.buttonSize[isIconOnly ? 'only' : 'default'][size], // Размер кнопки
    enumSizes.rounded[size], // Скругление
    disabled && enumClasses.disabled, // Стили при disabled
    className // Дополнительные классы
  );

  // Собираем классы для иконки
  const iconClasses = clsx(
    enumClasses.colorsIcon[variant], // Цвет иконки
    enumSizes.iconSize[isIconOnly ? 'only' : 'default'][size], // Размер иконки
    !isIconOnly && hasValidIconDirection && enumSizes.iconMargin[iconDirection][size], // Отступ
    iconClass // Дополнительные классы
  );

  return (
    <Tag
      ref={ref}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {/* Если иконка справа или отсутствует — сначала текст */}
      {iconDirection !== 'left' && children}

      {/* Отображение иконки, если она указана */}
      {icon && (
        <Icon
          icon={icon}
          variant={iconVariant}
          className={iconClasses}
        />
      )}

      {/* Если иконка слева — текст после неё */}
      {iconDirection === 'left' && children}
    </Tag>
  );
});

Button.displayName = 'Button';

export default Button;
