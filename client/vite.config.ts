  // import { defineConfig } from 'vite'
  // import react from '@vitejs/plugin-react'

  // // https://vite.dev/config/
  // export default defineConfig({
  //   plugins: [react()],
  //   server: {
  //     host: '0.0.0.0',
  //     port: Number(process.env.PORT) || 5173,
  //     proxy: {
  //       '/api': {
  //         target: 
  //         'https://triviagg.onrender.com',
  //         // Ajusta este puerto al puerto de tu servidor backend
  //         changeOrigin: true,
  //         secure: false,
  //       },
  //     },
  //   },
  //   preview: {
  //     host: '0.0.0.0',
  //     port: Number(process.env.PORT) || 5173,
  //   },
  // })
  import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://triviagg.onrender.com'
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://triviagg.onrender.com')
  }
})