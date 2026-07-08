import api from "../http";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post('/user/login', {
            email,
            password
        });
    }

    static async register(email: string, password: string, name: string, phone: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post('/user/register', {
            email,
            password,
            name,
            phone
        });
    }

    static async forgotPassword(email: string) {
        return api.post('/user/forgot-password', {
            email
        });
    }

    static async verifyResetCode(email: string, code: string) {
        return api.post('/user/verify-reset-code', {
            email,
            code
        });
    }

    static async resetPassword(token: string, newPassword: string) {
        return api.post('/user/reset-password', {
            newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    static async logout(): Promise<void>{
        return api.post('/user/logout');
    }
}