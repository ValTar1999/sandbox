/** @type {import('tailwindcss').Config} */

import formsPlugin from '@tailwindcss/forms'
import plugin from 'tailwindcss/plugin'
import { Colors as BadgeColors } from './src/enums/Badge'

const classBadgeColors = BadgeColors.map((color) => `text-${color}-800 text-${color}-400 bg-${color}-100 border-${color}-200 ring-${color}-200`)

export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',
  ],    
  safelist: [
    'hover:text-smart-secondary-darken',
    'focus-visible:ring-smart-main',
    'ring-gray-200',
    'ring-red-200',
    'ring-green-200',
    'ring-blue-200',
    'text-red-800',
    'text-blue-800',
    'text-green-800',
    'text-blue-400',
    'bg-red-100',
    'bg-blue-100',
    'bg-green-100',
    'overflow-x-auto',
    'min-w-5xl',
    ...classBadgeColors,
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"'],
        mono: ['"Roboto Mono"'],
      },
      width: {
        '1px': '1px',
        4.5: '18px',
        35: '8.75rem',
        50: '12.5rem',
        86: '21.5rem',
        90: '22.5rem',
        100: '26.75rem',
        128: '32rem',
        150: '37.5rem',
        160: '40rem',
        175: '42.5rem',
        200: '61.25rem',
      },
      maxWidth: {
        86: '21.5rem',
        95: '25rem',
        256: '64rem',
        '8xl': '88rem',
        '9xl': '96rem',
        120: '30rem',
        128: '32rem',
      },
      padding: {
        '3px': '3px',
        '5px': '5px',
        18.5: '4.63rem',
      },
      margin: {
        '1px': '1px',
        15: '3.75rem',
        18: '4.5rem',
      },
      transitionProperty: {
        width: 'width',
      },
      transformOrigin: {
        'center-left': 'center left',
      },
      opacity: {
        m: '0.918',
      },
      backgroundColor: {
        modal: 'rgba(17, 24, 39, 0.75)',
      },
      backgroundImage: {
        'purple-linear': 'linear-gradient(180deg, #8363ED 0%, #6336D1 100%)',
        'green-linear': 'linear-gradient(180deg, #10B981 0%, #42936C 100%)',
        'yellow-linear': 'linear-gradient(180deg, #F2C04B 0%, #E9A03B 100%)',
        'orange-gradient': 'linear-gradient(180deg, #ED964F 0%, #E97A35 100%)',
        'blue-gradient': 'linear-gradient(180deg, #3290FF 0%, #0240D1 100%)',
        'dark-blue-gradient': 'linear-gradient(180deg, #02296C -26%, #011A46 100%)',
        'collect-gradient': 'linear-gradient(31deg, #0295C9 -23%, #0CD2E1 111%)',
        'rfp-gradient': 'linear-gradient(180deg, #4F46E5 0%, #2119A2 100%)',
        'card-gradient': 'linear-gradient(180deg, #3A4253 0%, #111827 100%)',
      },
      borderRadius: {
        '1px': '1px',
      },
      boxShadow: {
        'modal-style': '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
        dropdown: '0px 0px 0px 1px #0000000D, 0px 4px 6px -2px #0000000D, 0px 10px 15px -3px #0000001A',
      },
    },
  },
  plugins: [
    formsPlugin,
    plugin(({ addVariant }) => {
      addVariant('target-checked', ({ modifySelectors }) => {
        return modifySelectors(({ className }) => {
          return `.target-checked:checked ~ .${className}`
        })
      })
    }),
    plugin(({ addVariant }) => {
      addVariant('target-checked-deep', ({ modifySelectors }) => {
        return modifySelectors(({ className }) => {
          return `.target-checked:checked ~ * > .${className}`
        })
      })
    }),
  ],
};


