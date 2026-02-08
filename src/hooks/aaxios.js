import axios from 'axios';

const aaxios = axios.create({
  // baseURL: 'http://localhost:3000', // Replace with your API base URL
  baseURL: 'https://billerbackend-sepia.vercel.app', // Replace with your API base URL
  timeout: 10000
});

aaxios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default aaxios;