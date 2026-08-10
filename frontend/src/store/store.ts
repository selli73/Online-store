import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import type { IUser } from "../models/IUser";
import type IProduct from "../models/IProduct";
import type { ICart } from "../models/ICart";
import type { IOrder } from "../models/IOrder";
import type { IProductEdit } from "../models/IProductEdit";
import type { ICreateProduct } from "../models/ICreateProduct";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    products: IProduct[] = [];
    product = {} as IProduct;
    totalPage: number = 0;
    cart: ICart | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setProducts(products: IProduct[]) {
        this.products = products;
    }

    setProduct(product: IProduct) {
        this.product = product;
    }

    setTotalPage(totalPage: number) {
        this.totalPage = totalPage;
    }

    setCart(cart: ICart) {
        this.cart = cart;
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

    async getAllProducts(page: number, limit: number) {
        try {
            const response = await AuthService.getAllProducts(page, limit);
            this.setProducts(response.data.products);
            this.setTotalPage(response.data.totalPages);
        } catch(error) {
            throw error;
        }
    }

    async getProduct(id: string) {
        try {
            const response = await AuthService.getProduct(id);
            this.setProduct(response.data);
        } catch(error) {
            throw error;
        }
    }

    async createProduct(dto: ICreateProduct) {
        try {
            const response = await AuthService.createProduct(dto);            
        } catch(error) {
            throw error;
        }
    }

    async addToCart(productId: string, quantity: number) {
        try {
            await AuthService.addToCart(productId, quantity);           
        } catch(error) {
            throw error;
        }
    }

    async getCart() {
        try {
            const response = await AuthService.getCart();
            this.setCart(response.data);
        } catch(error) {
            throw error;
        }
    }

    async changeQuantityOfProduct(cartItemId: string, quantity: number) {
        try {
            await AuthService.changeQuantityOfProduct(cartItemId, quantity);     
            await this.getCart();
        } catch(error) {
            throw error;
        }
    }

    async deleteCartItem(cartItemId: string) {
        try {
            await AuthService.deleteCartItem(cartItemId);
            await this.getCart();
        } catch(error) {
            throw error;
        }
    }

    async createOrder(data: IOrder) {
        try {
            const response = await AuthService.createOrder(data);
            await this.getCart();
            return response.data;
        } catch(error) {
            throw error;
        }
    }

   async getPaymentDetails(orderId: string) {
        try {
            const response = await AuthService.getPaymentDetails(orderId);
            return response.data;
        } catch(error) {
            throw error;
        }
   }

   async notifyManualPayment(orderId: string) {
        try {
            const response = await AuthService.notifyManualPayment(orderId);
            return response.data;
        } catch(error) {
            throw error;
        }
   }

   async getOrderById(orderId: string) {
        try {
            const response = await AuthService.getOrderById(orderId);
            return response.data;
        } catch(error) {
            throw error;
        }
   }

   async getMyOrders() {
        try {
            const response = await AuthService.getMyOrders();
            return response.data;
        } catch(error) {
            throw error;
        }
   }

   async getOrdersAwatingConfirmation() {
        try {
            const response = await AuthService.getOrdersAwatingConfirmation();
            return response.data;
            
        } catch(error) {
            throw error;
        }
   }

   async confirmPayment(orderId: string) {
        try {
            const response = await AuthService.confirmPayment(orderId);
            return response;
        } catch(error) {
            throw error;
        }
   }

   async createReview(rating: number, productId: string, text: string) {
        try {
            const response = await AuthService.createReview(rating, productId, text);
            return response.data;
        } catch(error) {
            throw error;
        }
   }

   async deleteProduct(productId: string) {
        try {
            const response = await AuthService.deleteProduct(productId);
            
            this.setProducts(
                this.products.filter(product => product.id !== productId)
            );

            return {
                response: response.data,
                message: 'Товар успешно удален'
            };
        } catch(error) {
            throw error;
        }
   }

   async editProduct(productId: string, dto: IProductEdit) {
        try {
            const response = await AuthService.editProduct(productId, dto);

            this.setProducts(
                this.products.map(product =>
                    product.id === productId
                        ? { ...product, ...dto }
                        : product
                )
            );

            return {
                response: response.data,
                message: 'Товар успешно обновлен'
            };
        } catch(error) {
            throw error
        }
   }
}