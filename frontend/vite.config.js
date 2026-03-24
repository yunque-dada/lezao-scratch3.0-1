import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // 允许的host
    preview: {
      allowedHosts: ['lezao.up.railway.app', 'lezao-houduan.up.railway.app']
    },
    
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
      // API代理（开发环境）
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    
    // 生产环境环境变量
    envPrefix: 'VITE_',
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || '')
    },
    
    // 优化依赖
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons']
    }
  }
})
