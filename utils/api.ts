import axios from 'axios';
import storage from './storage';
import config from './config';

const API_URL = config.backendUrl;

const api = axios.create({
  baseURL: `${API_URL}${config.apiPath}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;