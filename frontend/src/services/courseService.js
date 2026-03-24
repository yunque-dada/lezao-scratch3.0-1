import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const courseService = {
  getCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response;
  },
  
  getCourse: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response;
  },
  
  createCourse: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/courses`, data);
    return response;
  },
  
  updateCourse: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/courses/${id}`, data);
    return response;
  },
  
  deleteCourse: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/courses/${id}`);
    return response;
  }
};

export default courseService;
