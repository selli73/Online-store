const API_URL = 'http://localhost:3000'

type AuthResponse = {
    access_token: string;
};

type LoginPayload = {
    email: string;
    password: string;
}

type MessageResponse = {
    message: string;
};

type RegisterPayload = {
    email: string;
    password: string;
    name?: string;
    phone?: string;
}

type ForgotPasswordPayload = {
    email: string;
}

type VerifyResetCodePayload = {
    email: string;
    code: string;
}

type ResetPasswordPayload = {
    newPassword: string;
}

async function request(path: string, body: unknown) {
    const response = await fetch(`${API_URL}${path}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
        const message = Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Ошибка запроса';
        throw new Error(message);
    }

    return data;
}

export const loginUser = (payload: LoginPayload) => {
    return request('/user/login', payload);
}

export const registerUser = (payload: RegisterPayload) => {
    return request('/user/register', payload);
}

export function forgotPassword(payload: ForgotPasswordPayload) {
    return request('/user/forgot-password', payload);
}

export function verifyResetCode(payload: VerifyResetCodePayload) {
    return request('/user/verify-reset-code', payload);
}

export async function resetPassword(resetToken: string, payload: ResetPasswordPayload) {
    const response = await fetch(`${API_URL}/user/reset-password`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Ошибка сброса пароля';

        throw new Error(message);
    }

    return data as MessageResponse;
}

export const saveToken = (token: string) => {
    localStorage.setItem('access_token', token);
}

export function getToken() {
    return localStorage.getItem('access_token');
}

export function logout() {
    localStorage.removeItem('access_token');
}

loginUser({ "email": "aabulath@gmail.com", "password": "12345678" });