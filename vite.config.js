import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true, // Automatically open the browser on server start
    proxy: {
      '/api': {
        target: 'http://localhost:8080', //  Backend Spring Boot server address
        changeOrigin: true
        // ❌ Do not use rewrite, otherwise it will remove the /api prefix and cause 404 errors
      }
    }
  }
});
