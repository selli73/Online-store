import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import type { IUser } from "../models/IUser";

export default class Store {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);            
            localStorage.setItem('access_token', response.data.access_token);            
            this.setAuth(true);
        } catch (error) {
            throw error;
        }
    }

    async register(email: string, password: string, name: string, phone: string) {
        try {
            const response = await AuthService.register(email, password, name, phone);
            localStorage.setItem('access_token', response.data.access_token);
            this.setAuth(true);
        } catch(error) {
            throw error;
        }
    }
    
    async changePassword(oldPassword: string, newPassword: string) {
        try {
            const response = await AuthService.changePassword(oldPassword, newPassword);
            return response;
        }
        catch (error) {
            throw error;
        }
    }

    async forgotPassword(email: string) {
        try {
            return AuthService.forgotPassword(email);
        } catch(error) {
            throw error;
        }
    }

    async verifyResetCode(email: string, code: string) {
        try {
            const response = await AuthService.verifyResetCode(email, code);
            sessionStorage.setItem('resetToken', response.data.resetToken);
        } catch(error) {
            throw error;
        }
    }

    async resetPassword(newPassword: string) {
        try {
            const response = await AuthService.resetPassword(newPassword);
            return response.statusText;
        } catch(error) {
            throw error;
        }
    }

    async profileMe() {
        try {
            const response = await AuthService.profileMe();
            this.setUser(response.data.user);
            this.setAuth(true);
        } catch(error) {
            this.setAuth(false);
            localStorage.removeItem('access_token');
            throw error;
        }
    }

    async logout() {
        try {
            localStorage.removeItem('access_token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch(error) {
            throw error;
        }
    }
}