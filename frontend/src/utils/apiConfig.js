/**
 * API 配置
 */

// 开发环境
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// 生产环境配置（Railway等）
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-production-api.com';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default API_CONFIG;
