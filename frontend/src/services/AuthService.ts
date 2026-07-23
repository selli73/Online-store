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

    static async changePassword(oldPassword: string, newPassword: string) {
        return api.put('/user/change-password', {
            oldPassword,
            newPassword
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

    static async resetPassword(newPassword: string) {
        return api.post('/user/reset-password', {
            newPassword
        },
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('resetToken')}`
            }
        });
    }

    static async profileMe() {
        return api.get('/profile/me');
    }

    static async getAllProducts(page: number, limit: number) {
        return api.get(`/product/all?page=${page}&limit=${limit}`);
    }

    static async getProduct(id: string) {
        return api.get(`/product/${id}`);
    }

    static async addToCart(productId: string, quantity: number) {
        return api.post('/cart/addProduct', {
            productId,
            quantity
        });
    }

    static async getCart() {
        return api.get('/cart');
    }

    static async changeQuantityOfProduct(cartItemId: string, quantity: number) {
        return api.patch('/cart', {
            cartItemId,
            quantity
        });
    }

    static async deleteCartItem(cartItemId: string) {
        return api.delete(`/cart/${cartItemId}`);
    }
}