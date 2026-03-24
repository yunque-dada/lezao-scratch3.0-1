import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const workService = {
  getWorks: async () => {
    const response = await axios.get(`${API_BASE_URL}/works`);
    return response;
  },
  
  getWork: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/works/${id}`);
    return response;
  },
  
  createWork: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/works`, data);
    return response;
  },
  
  updateWork: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/works/${id}`, data);
    return response;
  },
  
  deleteWork: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/works/${id}`);
    return response;
  }
};

export default workService;
