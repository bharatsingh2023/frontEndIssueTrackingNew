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
      },
      '/ChatUrl': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ChatUrl/, ''),
        timeout: 30000,
        proxyTimeout: 30000,
      },
      wsOptions: {
        timeout: 30000, // WebSocket timeout
        keepAlive: 10000, // Interval for keep-alive ping (in milliseconds)
      },
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
