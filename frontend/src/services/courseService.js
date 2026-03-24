/**
 * 课程服务
 */
const API_CONFIG = require('../utils/apiConfig');

const API_URL = API_CONFIG.baseURL + '/api/courses';

// 获取课程列表
const getCourses = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}?${queryString}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 获取课程详情
const getCourseById = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 创建课程
const createCourse = async (courseData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 更新课程
const updateCourse = async (id, courseData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(courseData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 删除课程
const deleteCourse = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

// 章节管理
const addChapter = async (courseId, chapterData, token) => {
  const response = await fetch(`${API_URL}/${courseId}/chapters`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chapterData)
  });
  const data = await response.json();
  if (!response.ok) throw { response: { data: { message: data.message } } };
  return data;
};

const courseService = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addChapter
};

module.exports = courseService;
