import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/chat-websocket': {
        target: 'ws://localhost:8083',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/chat-websocket/, ''),
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
