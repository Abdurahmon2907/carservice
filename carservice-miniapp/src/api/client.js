import axios from 'axios';

// Dev (npm run dev): Vite proxies /api to localhost:3000.
// Production build (Vercel): call the Railway backend directly.
const client = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : `${(import.meta.env.VITE_API_URL || '').trim()}/api`,
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