import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ajusta este puerto al puerto de tu servidor backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
