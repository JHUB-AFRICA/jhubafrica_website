import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [TanStackRouterVite(), react(), tailwindcss()],
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