export const Sizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'xxxl',
] as const

export type TSizes = (typeof Sizes)[number]

export const classes = {
  xs: {
    image: 'w-6 h-6',
    notifications: 'w-1.5 h-1.5',
    text: 'text-xs',
  },
  sm: {
    image: 'w-8 h-8',
    notifications: 'w-2 h-2',
    text: 'text-sm',
  },
  md: {
    image: 'w-10 h-10',
    notifications: 'w-2.5 h-2.5',
    text: 'text-base',
  },
  lg: {
    image: 'w-12 h-12',
    notifications: 'w-3 h-3',
    text: 'text-lg',
  },
  xl: {
    image: 'w-14 h-14',
    notifications: 'w-3.5 h-3.5',
    text: 'text-xl',
  },
  xxl: {
    image: 'w-16 h-16',
    notifications: 'w-4 h-4',
    text: 'text-2xl',
  },
  xxxl: {
    image: 'w-20 h-20',
    notifications: 'w-5 h-5',
    text: 'text-2xl',
  },
}
