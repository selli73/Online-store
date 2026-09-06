import axios from 'axios';

export const API_URL: string = '/api';

export const TOKEN_KEY = 'access_token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = getToken();

    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/**
 * Колбэк, который стор навешивает при старте приложения: единая реакция на
 * протухший токен, чтобы каждый компонент не разбирался с 401 самостоятельно.
 */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
    onUnauthorized = handler;
}

/** Эндпоинты, где 401 — это нормальный бизнес-ответ, а не протухшая сессия. */
const PUBLIC_AUTH_PATHS = ['/user/login', '/user/register', '/user/forgot-password', '/user/verify-reset-code'];

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url ?? '';
        const isAuthCall = PUBLIC_AUTH_PATHS.some((path) => url.includes(path));

        if (error.response?.status === 401 && !isAuthCall) {
            clearToken();
            onUnauthorized?.();
        }

        return Promise.reject(error);
    },
);

export default api;
