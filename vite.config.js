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
    open: true, // 自动打开浏览器（可选）
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 后端接口地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 🔥 正确去掉/api前缀，避免后端报错
      }
    }
  }
});
