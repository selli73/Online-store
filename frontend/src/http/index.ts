import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    withCredentials: true, // Чтобы к каждому запросу куки цеплялись автоматически
    baseURL: API_URL
});



export default api;