import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 生产环境优化
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd': ['antd', '@ant-design/icons'],
          'redux': ['@reduxjs/toolkit', 'react-redux']
        }
      }
    },
    // 开启gzip压缩
    compressOnAdd: true,
    minify: 'terser',
    sourcemap: false,
    // 分块大小警告限制
    chunkSizeWarningLimit: 1500
  },
  
  // 开发服务器配置
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // API代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  
  // 优化依赖
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons']
  }
})
