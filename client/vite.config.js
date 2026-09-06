import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://eld7e7-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});