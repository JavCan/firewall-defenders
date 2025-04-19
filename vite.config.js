import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Cambia esto a la URL correcta de tu backend
        changeOrigin: true,
        // Comenta o elimina la línea de rewrite si tu backend espera el prefijo /api
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
