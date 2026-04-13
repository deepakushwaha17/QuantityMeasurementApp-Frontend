import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';


const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('qm_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qm_token');
      localStorage.removeItem('qm_email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_URL };
