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
            localStorage.setItem('token', response.data.access_token);
            this.setAuth(true);
            return response;            
        } catch (e) {
            console.log(e);
        }
    }

    async register(email: string, password: string, name: string, phone: string) {
        try {
            const response = await AuthService.register(email, password, name, phone);
            console.log(response);
            localStorage.setItem('token', response.data.access_token);
            this.setAuth(true);
        } catch(e) {
            console.log(e);
        }
    }
    
    async forgotPassword(email: string) {
        try {
            const response = await AuthService.forgotPassword(email);
            return response;
        } catch(error) {
            console.log(error);
        }
    }

    async verifyResetCode(email: string, code: string) {
        try {
            const response = await AuthService.verifyResetCode(email, code);
            return response;
        } catch(error) {
            console.log(error);
        }
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const response = await AuthService.resetPassword(token, newPassword);
            return response;
        } catch(error) {
            console.log(error);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
        } catch(e) {
            console.log(e);
        }
    }
}