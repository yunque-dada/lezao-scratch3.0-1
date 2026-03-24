/**
 * 作品服务
 */
const API_CONFIG = require('../utils/apiConfig');

const API_URL = API_CONFIG.baseURL + '/api/works';

// 获取作品列表
const getWorks = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}?${queryString}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 获取作品详情
const getWorkById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 提交作品
const createWork = async (workData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 更新作品
const updateWork = async (id, workData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 删除作品
const deleteWork = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 批改作品
const gradeWork = async (id, gradeData, token) => {
  const response = await fetch(`${API_URL}/${id}/grade`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gradeData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 添加评论
const commentWork = async (id, comment, token) => {
  const response = await fetch(`${API_URL}/${id}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: comment })
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

const workService = {
  getWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
  gradeWork,
  commentWork
};

module.exports = workService;
