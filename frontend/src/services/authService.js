/**
 * 认证服务
 */
const API_URL = 'http://localhost:3000/api/auth';

// 注册
const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data: { message: data.message } } };
  }

  return data;
};

// 登录
const login = async (userData) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data: { message: data.message } } };
  }

  return data;
};

// 登出
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// 获取当前用户信息
const getMe = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data: { message: data.message } } };
  }

  return data;
};

// 刷新令牌
const refreshToken = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data: { message: data.message } } };
  }

  localStorage.setItem('token', data.token);
  return data.token;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  refreshToken
};

export default authService;
