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
      '/BaseUrl': {
        target: 'http://localhost:8086',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/BaseUrl/, ''),
      },

      '/chat-websocket': {
        target: 'ws://localhost:8083',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/chat-websocket/, ''),
      },
      '/issueListBase': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/issueListBase/, ''),
      },

      '/signupBase': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/signupBase/, ''),
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
