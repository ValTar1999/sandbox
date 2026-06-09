import type { SmartExchangeRowStatus, SmartExchangeTab } from './data';

export const SMART_EXCHANGE_TAB_LABELS: SmartExchangeTab[] = [
  'pending',
  'paid',
  'exceptions',
];

export const SMART_EXCHANGE_TAB_TITLES: Record<SmartExchangeTab, string> = {
  pending: 'Pending',
  paid: 'Paid',
  exceptions: 'Exceptions',
};

export type ActivityLogIconKey = SmartExchangeRowStatus | 'initiated';

export const ACTIVITY_LOG_ICONS: Record<
  ActivityLogIconKey,
  { icon: string; className: string }
> = {
  pending_your_action: {
    icon: 'clock',
    className: 'h-3.5 w-3.5 text-yellow-500',
  },
  initiated: {
    icon: 'in-progress',
    className: 'h-3.5 w-3.5 text-gray-500',
  },
  paid: {
    icon: 'check-circle',
    className: 'h-3.5 w-3.5 text-green-500',
  },
  exception: {
    icon: 'exclamation-circle',
    className: 'h-3.5 w-3.5 text-red-500',
  },
};

export const ACTIVITY_LOG_LINK_CLASS =
  'cursor-pointer font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-700';
