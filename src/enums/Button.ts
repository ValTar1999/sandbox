import { focusButton } from '../config/commonStyles'

export const Variants = [
  'primary',
  'secondary',
  'primaryTransparent',
  'primaryDistructive',
  'yellow',
  'linkYellow',
  'green',
  'linkGreen',
  'gray',
  'linkPrimary',
  'linkSecondary',
  'linkError',
  'add_on',
] as const

export type TVariants = (typeof Variants)[number]

export const sizes = {
  buttonSize: {
    default: {
      xl: 'text-base px-3.5 py-2.5',
      lg: 'text-base px-3 py-2',
      md: 'text-sm px-2.5 py-1.5',
      sm: 'text-sm px-2 py-1',
      xs: 'text-xs px-1.5 py-0.5',
    },
    only: {
      xl: 'p-2.5',
      lg: 'p-2',
      md: 'p-1.5',
      sm: 'p-1',
      xs: 'p-0.5',
    },
  },
  iconSize: {
    default: {
      xl: 'w-5 h-5',
      lg: 'w-5 h-5',
      md: 'w-5 h-5',
      sm: 'w-4.5 h-4.5',
      xs: 'w-4 h-4',
    },
    only: {
      xl: 'w-5 h-5',
      lg: 'w-5 h-5',
      md: 'w-5 h-5',
      sm: 'w-4.5 h-4.5',
      xs: 'w-4 h-4',
    },
  },
  iconMargin: {
    left: {
      xl: '-ml-1 mr-3',
      lg: '-ml-1 mr-3',
      md: '-ml-1 mr-2',
      sm: '-ml-0.5 mr-1.5',
      xs: '-ml-0.5 mr-1',
    },
    right: {
      xl: '-mr-1 ml-3',
      lg: '-mr-1 ml-3',
      md: '-mr-1 ml-2',
      sm: '-mr-0.5 ml-1.5',
      xs: '-mr-0.5 ml-1',
    },
  },
  rounded: {
    xl: 'rounded-md',
    lg: 'rounded-md',
    md: 'rounded-md',
    sm: 'rounded',
    xs: 'rounded',
  },
}

export const classes = {
  common: 'inline-flex h-fit items-center justify-center font-medium text-center whitespace-nowrap cursor-pointer transition-all duration-300',
  disabled: 'opacity-40 pointer-events-none',
  colors: {
    primary: `bg-smart-main text-white shadow-sm hover:bg-smart-main-darken ${focusButton('focus-visible:ring-blue-600')}`,
    secondary: `bg-white text-gray-700 shadow-sm hover:bg-gray-50 custom-ring-btn-secondary ${focusButton('focus-visible:ring-blue-600')}`,
    gray: `bg-gray-100 text-gray-600 hover:bg-gray-200 ${focusButton('focus-visible:ring-smart-main')}`,
    linkPrimary: `bg-transparent text-smart-secondary group hover:text-smart-secondary-darken ${focusButton('focus-visible:ring-smart-main')}`,
    linkSecondary: `bg-transparent text-gray-500 group hover:text-gray-600 ${focusButton('focus-visible:ring-smart-main')}`,
    linkError: `bg-transparent text-red-500 group hover:text-red-600 ${focusButton('focus-visible:ring-red-600')}`,
    primaryDistructive: `bg-red-600 text-white shadow-sm hover:bg-red-700 ${focusButton('focus-visible:ring-red-600')}`,
    primaryTransparent: `bg-blue-50 text-blue-600 hover:bg-blue-100 ${focusButton('focus-visible:ring-blue-600')}`,
    yellow: `bg-yellow-600 text-white hover:bg-yellow-700 ${focusButton('focus-visible:ring-yellow-600')}`,
    green: `bg-green-600 text-white hover:bg-green-700 ${focusButton('focus-visible:ring-green-600')}`,
    add_on: `text-gray-500 outline-0 ${focusButton('focus-visible:ring-blue-600')}`,
    linkYellow: `bg-transparent text-yellow-500 group hover:text-yellow-600 ${focusButton('focus-visible:ring-yellow-600')}`,
    linkGreen: `bg-transparent text-green-500 group hover:text-green-600 ${focusButton('focus-visible:ring-green-600')}`,
  },
  colorsIcon: {
    primary: 'text-white',
    secondary: 'text-gray-500',
    primaryTransparent: 'text-blue-500',
    primaryDistructive: 'text-white',
    yellow: 'text-white',
    linkYellow: 'text-yellow-400 group-hover:text-yellow-500',
    green: 'text-white',
    linkGreen: 'text-green-400 group-hover:text-green-500',
    gray: 'text-gray-500',
    linkPrimary: 'text-smart-secondary group-hover:text-smart-secondary-darken',
    linkSecondary: 'text-gray-400 group-hover:text-gray-500',
    linkError: 'text-red-400 group-hover:text-red-500',
    add_on: 'text-gray-400',
  },
}
