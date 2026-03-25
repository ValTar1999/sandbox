import { useState } from 'react'
import clsx from 'clsx'
import Icon from '../base/Icon'
import Spinner from '../base/Spinner'

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
      {status === 'loading' && <Spinner className="size-4.5" />}
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
