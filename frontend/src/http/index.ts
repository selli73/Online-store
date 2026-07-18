import axios from 'axios';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

export default api;