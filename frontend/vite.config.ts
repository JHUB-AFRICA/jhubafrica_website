import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tsconfigPaths()],
  preview: {
    allowedHosts: ['.jhubafrica.com', 'localhost', 'www.jhubafrica.com', 'jhubafrica.com'],
  },
  server: {
    allowedHosts: ['jhubafrica.com', 'www.jhubafrica.com', 'localhost'],
  },
})