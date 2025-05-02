import { useState } from 'react'
import clsx from 'clsx'
import Icon from '../base/Icon'

function Spinner() {
  return (
    <svg
      className="size-4.5 animate-spin text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="text-gray-200"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function RefreshButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleClick = async () => {
    if (status === 'loading') return
    setStatus('loading')

    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStatus('success')

    setTimeout(() => setStatus('idle'), 2000)
  }

  const iconClasses = clsx('w-4.5 h-4.5', {
    'text-green-500': status === 'success',
    'text-gray-500': status === 'idle',
  })

  const textClasses = clsx('text-sm font-semibold', {
    'text-green-600': status === 'success',
    'text-gray-600': status !== 'success',
  })

  const buttonClasses = clsx(
    'inline-flex items-center px-2 py-1 rounded transition cursor-pointer duration-300 gap-1',
    {
      'bg-gray-100 hover:bg-gray-200': status !== 'success',
      'bg-green-50': status === 'success',
    }
  )

  return (
    <button
      type="button"
      aria-busy={status === 'loading'}
      onClick={handleClick}
      className={buttonClasses}
    >
      {status === 'loading' && <Spinner />}
      {status === 'success' && <Icon icon="check" className={iconClasses} />}
      {status === 'idle' && <Icon icon="refresh" className={iconClasses} />}

      <span className={textClasses}>
        {status === 'idle' && 'Refresh'}
        {status === 'loading' && 'Refreshing...'}
        {status === 'success' && 'Refresh complete'}
      </span>
    </button>
  )
}
