import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@env': path.resolve(__dirname, 'src/environments'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: '0.0.0.0',  // Allow access from Docker container
    port: Number(process.env.VITE_PORT) || 5174, // Use VITE_PORT from environment or fallback to 5173
    strictPort: true,  // Prevent Vite from switching ports
  },
})
