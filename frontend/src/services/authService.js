import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lezao-houduan.up.railway.app/api';

// 添加响应拦截器处理错误
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 服务器返回了错误状态
      console.error('API错误:', error.response.status, error.response.data);
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('网络错误:', error.message);
    } else {
      // 请求配置出错
      console.error('请求错误:', error.message);
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
