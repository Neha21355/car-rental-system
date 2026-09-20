import axios from 'axios';

// Vite proxy: /api -> http://localhost:1571 (same-origin cookies)
const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    let message = 'Something went wrong';
    const data = err.response?.data;
    if (typeof data === 'string') message = data;
    else if (data?.message) message = data.message;
    else if (err.message) message = err.message;
    return Promise.reject(new Error(message));
  }
);

export default api;
