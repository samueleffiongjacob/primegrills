import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',  // Allow access from Docker container
    port: Number(process.env.VITE_PORT) || 5176, // Use VITE_PORT from environment or fallback to 5173
    strictPort: true,  // Prevent Vite from switching ports
  },
})
