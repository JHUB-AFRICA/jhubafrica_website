import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  preview: { allowedHosts: ['jhubafrica.com', 'www.jhubafrica.com', 'localhost'] },
  resolve: {
    tsconfigPaths: true,
  },
})