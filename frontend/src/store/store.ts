import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";

export default class Store {
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
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
    
    async forgotPassword(email: string) {
        try {
            const response = await AuthService.forgotPassword(email);
            return response;
        } catch(error) {
            throw error;
        }
    }

    async verifyResetCode(email: string, code: string) {
        try {
            const response = await AuthService.verifyResetCode(email, code);
            sessionStorage.setItem('resetToken', response.data.resetToken);
            console.log('Пошли дальше');
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

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('access_token');
            this.setAuth(false);
        } catch(error) {
            throw error;
        }
    }
}