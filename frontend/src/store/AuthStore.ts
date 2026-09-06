import { makeAutoObservable, runInAction } from 'mobx';
import { AuthApi } from '../api/auth.api';
import { clearToken, getToken, setToken } from '../api/client';
import type { IUser } from '../models';

const RESET_TOKEN_KEY = 'reset_token';

export class AuthStore {
    user: IUser | null = null;
    /** true, пока идёт стартовая проверка сохранённого токена. */
    isBootstrapping = true;

    constructor() {
        makeAutoObservable(this);
    }

    get isAuth(): boolean {
        return this.user !== null;
    }

    get isAdmin(): boolean {
        return this.user?.role === 'ADMIN';
    }

    setUser(user: IUser | null) {
        this.user = user;
    }

    /**
     * Вызывается один раз при старте приложения: если в localStorage лежит токен,
     * проверяем его и восстанавливаем сессию. Без этого любая перезагрузка
     * страницы сбрасывала бы пользователя в «не авторизован».
     */
    async bootstrap() {
        if (!getToken()) {
            runInAction(() => {
                this.isBootstrapping = false;
            });
            return;
        }

        try {
            const { data } = await AuthApi.me();
            runInAction(() => {
                this.user = data.user;
            });
        } catch {
            clearToken();
            runInAction(() => {
                this.user = null;
            });
        } finally {
            runInAction(() => {
                this.isBootstrapping = false;
            });
        }
    }

    async login(email: string, password: string) {
        const { data } = await AuthApi.login(email, password);
        setToken(data.access_token);

        const me = await AuthApi.me();
        runInAction(() => {
            this.user = me.data.user;
        });
    }

    async register(payload: { email: string; password: string; name?: string; phone?: string }) {
        const { data } = await AuthApi.register(payload);
        setToken(data.access_token);

        const me = await AuthApi.me();
        runInAction(() => {
            this.user = me.data.user;
        });
    }

    logout() {
        clearToken();
        sessionStorage.removeItem(RESET_TOKEN_KEY);
        this.user = null;
    }

    changePassword(oldPassword: string, newPassword: string) {
        return AuthApi.changePassword(oldPassword, newPassword);
    }

    forgotPassword(email: string) {
        return AuthApi.forgotPassword(email);
    }

    async verifyResetCode(email: string, code: string) {
        const { data } = await AuthApi.verifyResetCode(email, code);
        sessionStorage.setItem(RESET_TOKEN_KEY, data.resetToken);
    }

    async resetPassword(newPassword: string) {
        const resetToken = sessionStorage.getItem(RESET_TOKEN_KEY);

        if (!resetToken) {
            throw new Error('Код подтверждения истёк, начните восстановление заново');
        }

        await AuthApi.resetPassword(resetToken, newPassword);
        sessionStorage.removeItem(RESET_TOKEN_KEY);
    }
}
