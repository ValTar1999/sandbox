import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  base: '/sandbox/',
  plugins: [
    tailwindcss(),
    tsconfigPaths()
  ],
})
