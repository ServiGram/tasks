import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, //Este debe ser igual al de docker-compose.yml
    strictPort: true, // Error si el puerto ya está en uso
  },
  build: {
    outDir: 'dist',
  },
});
