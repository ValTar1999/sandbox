import React from 'react'
import { clsx } from 'clsx'
import { TIconName, TIconVariant } from '../../enums/Icon'

/**
 * Компонент для отображения иконок из спрайтов
 * @param icon - Имя иконки для отображения
 * @param variant - Вариант иконки (solid, outline, bicolor, mini)
 * @param className - Дополнительные CSS классы для применения
 * @param props - Дополнительные SVG пропсы
 */
interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: TIconName // Имя иконки
  variant?: TIconVariant // Вариант иконки (по умолчанию 'solid')
}

const SPRITE_MAP: Record<TIconVariant, string> = {
  solid: 'heroicons-solid.sprite.svg', // Спрайт для solid иконок
  outline: 'heroicons-outline.sprite.svg', // Спрайт для outline иконок
  bicolor: 'bicolor.sprite.svg', // Спрайт для bicolor иконок
  mini: 'heroicons-mini.sprite.svg', // Спрайт для mini иконок
} as const

const Icon: React.FC<IconProps> = ({ 
  icon, // Имя иконки
  variant = 'solid', // Вариант иконки
  className, // Дополнительные классы
  ...props // Прочие пропсы для SVG
}) => {
  // Проверяем, есть ли класс ширины в className
  const hasWidthClass = className?.match(/(^(w-)|( w-))(.)/g)

  // Формируем классы для иконки
  const iconClasses = clsx(
    'flex-shrink-0 transition-all duration-300', // Основные классы для гибкости и анимации
    !hasWidthClass && 'w-5 h-5', // Если нет класса ширины, задаем размер 5x5
    className // Добавляем дополнительные классы
  )

  return (
    <svg
      className={iconClasses} // Применяем классы
      xmlns="http://www.w3.org/2000/svg" // Пространство имен для SVG
      viewBox="0 0 20 20" // Размеры вьюпорта SVG
      aria-hidden="true" // Для доступности
      {...props} // Прочие SVG пропсы (например, fill, stroke и т.д.)
    >
      {/* Используем спрайт для отображения иконки */}
      <use href={`../assets/images/sprites/${SPRITE_MAP[variant]}#${icon}`} />
    </svg>
  )
}

export default Icon
