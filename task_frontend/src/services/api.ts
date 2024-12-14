import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://127.0.0.1:8000/api',
    //baseURL: 'https://tasks-56qx.onrender.com',
    //baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'http://backend:8000/api',
});

export default api;

