export const Colors = [
  'yellow',
  'blue',
  'red',
  'green',
] as const

export type TColors = (typeof Colors)[number]
