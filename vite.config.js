import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {

      '/BaseUrl': {
        target: 'http://localhost:8086',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/BaseUrl/, ''),
      }
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "./src/components/Navbar.css";`,
      },
    },
  },
});
