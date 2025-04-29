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
    open: true, // 启动自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // ✅ 后端 Spring Boot 地址
        changeOrigin: true
        // ❌ 不要使用 rewrite，否则会去掉 /api 前缀导致 404
      }
    }
  }
});
