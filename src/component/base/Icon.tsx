import React from 'react'
import { clsx } from 'clsx'
import { TIconName, TIconVariant } from '../../enums/Icon'

/**
 * @param icon - Имя иконки для отображения
 * @param variant - Вариант иконки (solid, outline, bicolor, mini)
 * @param className - Дополнительные CSS классы для применения
 * @param props - Дополнительные SVG пропсы
 */
interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: TIconName 
  variant?: TIconVariant
}

const SPRITE_MAP: Record<TIconVariant, string> = {
  solid: 'heroicons-solid.sprite.svg',
  outline: 'heroicons-outline.sprite.svg',
  bicolor: 'bicolor.sprite.svg', 
  mini: 'heroicons-mini.sprite.svg',
} as const

const Icon: React.FC<IconProps> = ({ 
  icon,
  variant = 'solid', 
  className,
  ...props 
}) => {
  const hasWidthClass = className?.match(/(^(w-)|( w-))(.)/g)

  const iconClasses = clsx(
    'flex-shrink-0 transition-all duration-300',
    !hasWidthClass && 'w-5 h-5', 
    className
  )

  return (
    <svg
      className={iconClasses} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20"
      aria-hidden="true" 
      {...props}
    >
      <use href={`/sandbox/assets/images/sprites/${SPRITE_MAP[variant]}#${icon}`} />
    </svg>
  )
}

export default Icon
