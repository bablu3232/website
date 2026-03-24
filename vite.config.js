import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://14.139.187.229:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/jan2026/spic741/drugsearch')
      }
    }
  }
})
