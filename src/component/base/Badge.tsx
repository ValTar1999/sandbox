import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';
import { focusButton } from '../../config/commonStyles';
import { type TColors, type TSizes, classes as enumClasses } from '../../enums/Badge';
import type { TIconName, TIconVariant, TIconDirectionLR } from '../../enums/Icon';

// Типизация пропсов для компонента Badge
type BadgeProps = {
  size?: TSizes; // размер (например: sm, lg)
  color?: TColors; // цвет (например: gray, blue и т.д.)
  rounded?: boolean; // закругленные углы (полностью круглые или нет)
  icon?: TIconName; // название иконки (если есть)
  iconVariant?: TIconVariant; // стиль иконки (например: solid, outline и т.п.)
  iconDirection?: TIconDirectionLR; // направление иконки: слева или справа от текста
  iconClickable?: boolean; // должна ли иконка быть кнопкой
  className?: string; // дополнительные классы
  children?: React.ReactNode; // контент внутри бейджа
} & React.HTMLAttributes<HTMLDivElement>;

const Badge: React.FC<BadgeProps> = ({
  size = 'lg',
  color = 'gray',
  rounded = false,
  icon,
  iconVariant,
  iconDirection = 'right',
  iconClickable,
  className,
  children,
}) => {
  // Если иконки нет, то и направление иконки не имеет значения
  const isIconDirectionMap = icon ? iconDirection : 'default';

  // Классы для контейнера бейджа
  const rootClasses = clsx(
    'inline-flex items-center py-0.5 whitespace-nowrap font-medium',
    // Цвета, если не кастомный цвет
    color !== 'custom' && `text-${color}-800 bg-${color}-100 ring-inset ring-1 ring-${color}-200`,
    // Размер шрифта в зависимости от размера бейджа
    size === 'lg' ? 'text-sm' : 'text-xs',
    // Закругление углов
    rounded ? 'rounded-full' : 'rounded',
    // Дополнительные классы из enumClasses
    enumClasses[size]?.[isIconDirectionMap],
    // Пользовательские классы
    className
  );

  // Классы для иконки
  const iconClasses = clsx(
    'w-3.5 h-3.5',
    `text-${color}-400`,
    // Отступ от текста, если иконка не кликабельная
    !iconClickable && (iconDirection === 'right' ? 'ml-1' : 'mr-1')
  );

  // Классы для кнопки-иконки, если иконка кликабельная
  const iconButtonClasses = clsx(
    iconDirection === 'right' ? 'ml-1' : 'mr-1',
    rounded ? 'rounded-full' : 'rounded-1px',
    focusButton() // фокус-стили из общей конфигурации
  );

  // Рендер иконки (или кнопки с иконкой, если iconClickable === true)
  const renderIcon = () => {
    if (!icon) return null;

    const iconElement = (
      <Icon 
        icon={icon} 
        variant={iconVariant} 
        className={iconClasses} 
      />
    );

    // Если иконка кликабельна — оборачиваем её в кнопку
    return iconClickable ? (
      <button className={iconButtonClasses}>
        {iconElement}
      </button>
    ) : iconElement;
  };

  return (
    <div className={rootClasses}>
      {/* Если иконка справа — сначала контент, потом иконка */}
      {iconDirection === 'right' && children}
      {renderIcon()}
      {/* Если иконка слева — сначала иконка, потом контент */}
      {iconDirection === 'left' && children}
    </div>
  );
};

export default Badge;
