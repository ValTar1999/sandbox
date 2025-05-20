import React from 'react'
import clsx from 'clsx'
import { TSizes, classes as enumClasses } from '../../enums/Avatar'

// Интерфейс пропсов компонента Avatar
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  firstName?: string
  lastName?: string
  fullName?: string
  size?: TSizes // размер аватара (xs, sm, md и т.д.)
  notification?: boolean // показывать ли индикатор уведомлений
  imageSrc?: string // ссылка на изображение
  className?: string // дополнительный CSS класс
}

// Функция для получения инициалов из полного имени или firstName/lastName
const getInitials = (fullName?: string, firstName?: string, lastName?: string): string => {
  if (fullName) {
    const parts = fullName.trim().split(' ')
    return parts[0]?.[0]?.toUpperCase() + (parts[1]?.[0]?.toUpperCase() || '')
  }

  return (
    (firstName?.[0]?.toUpperCase() || '') +
    (lastName?.[0]?.toUpperCase() || '')
  )
}

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  fullName,
  size = 'xs',
  notification,
  imageSrc,
  className,
  ...rest
}) => {

  const initials = getInitials(fullName, firstName, lastName)

  const showTextFallback = !imageSrc && (fullName || firstName || lastName)

  const placeholderSrc = '/assets/images/layout/avatar-placeholder.svg'

  const containerClasses = clsx(
    'relative',
    enumClasses[size].image,
    className
  )

  const notificationClasses = clsx(
    'absolute right-0 rounded-full ring-2 ring-white bg-green-400',
    enumClasses[size].notifications
  )

  const avatarWrapperClasses = 'w-full h-full rounded-full overflow-hidden bg-gray-100 ring-2 ring-white'

  const textFallbackClasses = clsx(
    'flex items-center justify-center rounded-full w-full h-full uppercase text-white bg-slate-500',
    enumClasses[size].text
  )

  const imageClasses = 'object-cover w-full h-full'

  return (
    <div className={containerClasses} {...rest}>
      {notification && (
        <div className={notificationClasses} />
      )}

      <div className={avatarWrapperClasses}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="User Avatar"
            className={imageClasses}
          />
        ) : showTextFallback ? (
          <div className={textFallbackClasses}>
            {initials}
          </div>
        ) : (
          <img
            src={placeholderSrc}
            alt="User Avatar Placeholder"
            className={imageClasses}
          />
        )}
      </div>
    </div>
  )
}

