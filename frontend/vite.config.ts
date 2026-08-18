import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    tsconfigPaths: true,
  },
  preview: {
    allowedHosts: ['.jhubafrica.com', 'localhost'],
  },
  server: {
    allowedHosts: ['jhubafrica.com', 'www.jhubafrica.com', 'localhost'],
  },
})