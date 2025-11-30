import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Agrega esto para Vercel
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Esto ayuda con el routing en producción
  preview: {
    port: 3000,
    host: true
  }
});