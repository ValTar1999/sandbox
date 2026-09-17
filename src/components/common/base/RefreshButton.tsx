import { useState } from 'react';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import Icon from '../base/Icon';
import Spinner from '../base/Spinner';
import Tooltip, { TooltipTrigger, TooltipContent } from './Tooltip';

const formatLastRefreshed = (date: Date) =>
  date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

export function RefreshButton() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date());

  const handleClick = async () => {
    if (status === 'loading') return;
    setStatus('loading');

    await queryClient.invalidateQueries();
    setLastRefreshedAt(new Date());
    setStatus('success');

    setTimeout(() => setStatus('idle'), 2000);
  };

  const iconClasses = clsx('w-4.5 h-4.5', {
    'text-green-500': status === 'success',
    'text-gray-500': status === 'idle',
  });

  const textClasses = clsx('text-sm font-semibold', {
    'text-green-600': status === 'success',
    'text-gray-600': status !== 'success',
  });

  const buttonClasses = clsx(
    'inline-flex items-center px-2 py-1 rounded transition cursor-pointer duration-300 gap-1',
    {
      'bg-gray-100 hover:bg-gray-200': status !== 'success',
      'bg-green-50': status === 'success',
    }
  );

  return (
    <Tooltip trigger="hover" placement="bottom">
      <TooltipTrigger as="span" className="inline-flex">
        <button
          type="button"
          aria-busy={status === 'loading'}
          onClick={handleClick}
          className={buttonClasses}
        >
          {status === 'loading' && <Spinner className="size-4.5" />}
          {status === 'success' && (
            <Icon icon="check" className={iconClasses} />
          )}
          {status === 'idle' && <Icon icon="refresh" className={iconClasses} />}

          <span className={textClasses}>
            {status === 'idle' && 'Refresh'}
            {status === 'loading' && 'Refreshing...'}
            {status === 'success' && 'Refresh complete'}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-dropdown"
      >
        <div className="text-xs text-gray-500">Last refreshed:</div>
        <div className="text-sm font-medium leading-5 text-gray-900">
          {formatLastRefreshed(lastRefreshedAt)}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
