/**
 * API 配置
 */

// 使用 Vite 环境变量
// 开发环境: VITE_API_BASE_URL 未设置时默认为 localhost:3000
// 生产环境: 在 Railway 控制台设置 VITE_API_BASE_URL 为后端服务地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;
