export const focusButton = (focusColorClass?: string) => {
  return `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${(focusColorClass || 'focus-visible:ring-blue-600').replace('focus-visible:', 'focus:')}`
}

export const focusItem = (focusColorClass?: string) => {
  return `focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${focusColorClass || 'focus-visible:border-blue-600'}`
}

export const link = () => {
  return `focus:outline-none text-blue-600 hover:text-blue-700 hover:underline`
}
