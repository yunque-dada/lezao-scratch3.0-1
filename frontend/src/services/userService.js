/**
 * 用户服务
 */
const API_CONFIG = require('../utils/apiConfig');

const API_URL = API_CONFIG.baseURL + '/api/admin/users';

// 获取用户列表
const getUsers = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}?${queryString}`, {
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

// 获取用户详情
const getUserById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
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

// 创建用户
const createUser = async (userData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
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

// 更新用户
const updateUser = async (id, userData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
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

// 删除用户
const deleteUser = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
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

// 重置密码
const resetPassword = async (id, newPassword, token) => {
  const response = await fetch(`${API_URL}/${id}/reset-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newPassword })
  });

  const data = await response.json();
  if (!response.ok) {
    throw { response: { data: { message: data.message } } };
  }
  return data;
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
};

module.exports = userService;
