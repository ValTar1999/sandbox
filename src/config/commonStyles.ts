export const focusButton = (focusColorClass?: string) => {
  return `focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${focusColorClass || 'focus-visible:ring-smart-secondary'}`
}

export const focusItem = (focusColorClass?: string) => {
  return `focus:outline-none focus-visible:ring-2 focus-visible:ring-smart-secondary ${focusColorClass || 'focus-visible:border-smart-secondary'}`
}

export const link = () => {
  return `focus:outline-none text-smart-main hover:text-smart-main-darken hover:underline`
}
