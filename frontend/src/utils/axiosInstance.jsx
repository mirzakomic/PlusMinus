import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Enable cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Read token from cookies
    const token = document.cookie.split('; ')
      .find(row => row.startsWith('auth='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token set in axios instance");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;