import axios from 'axios';
import { API_URL } from './axiosInstance';

// Use plain axios for auth (no token needed)
const authAxios = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const loginApi = async (email, password) => {
  const response = await authAxios.post('/auth/login', { email, password });
  return response.data;
};

export const signupApi = async (email, password) => {
  const response = await authAxios.post('/auth/signup', { email, password });
  return response.data;
};

export const getGoogleAuthUrl = () => {
  return `${API_URL}/oauth2/authorization/google`;
};
