import axios from 'axios';

const isPhone = window.Telegram?.WebApp?.initData;

const client = axios.create({
  baseURL: isPhone
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default client;