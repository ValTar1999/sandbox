export const CommonSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
] as const

export type TCommonSizes = (typeof CommonSizes)[number]
