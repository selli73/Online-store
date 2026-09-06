import api from './client';
import type { IAuthResponse, IUser } from '../models';

export const AuthApi = {
    login(email: string, password: string) {
        return api.post<IAuthResponse>('/user/login', { email, password });
    },

    register(payload: { email: string; password: string; name?: string; phone?: string }) {
        return api.post<IAuthResponse>('/user/register', payload);
    },

    me() {
        return api.get<{ message: string; user: IUser }>('/profile/me');
    },

    changePassword(oldPassword: string, newPassword: string) {
        return api.put('/user/change-password', { oldPassword, newPassword });
    },

    forgotPassword(email: string) {
        return api.post<{ message: string }>('/user/forgot-password', { email });
    },

    verifyResetCode(email: string, code: string) {
        return api.post<{ resetToken: string }>('/user/verify-reset-code', { email, code });
    },

    /** Ходит с отдельным reset-токеном, а не с обычным access-токеном. */
    resetPassword(resetToken: string, newPassword: string) {
        return api.post<{ message: string }>(
            '/user/reset-password',
            { newPassword },
            { headers: { Authorization: `Bearer ${resetToken}` } },
        );
    },
};
