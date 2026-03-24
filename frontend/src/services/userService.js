import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://lezao-houduan.up.railway.app/api';

const userService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response;
  },
  
  register: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response;
  },
  
  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response;
  },
  
  updateProfile: async (data) => {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, data);
    return response;
  }
};

export default userService;
