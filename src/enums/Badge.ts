export const Colors = [
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
  'custom',
] as const
export type TColors = (typeof Colors)[number]

export const Sizes = [
  'lg',
  'sm',
] as const
export type TSizes = (typeof Sizes)[number]

export const classes = {
  lg: {
    default: 'px-2',
    left: 'pl-2 pr-2.5',
    right: 'pl-2.5 pr-2',
  },
  sm: {
    default: 'px-2.5',
    left: 'pl-2 pr-2',
    right: 'pl-2 pr-2',
  },
}
