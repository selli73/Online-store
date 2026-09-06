import api from './client';
import type { ICart } from '../models';

export const CartApi = {
    get() {
        return api.get<ICart>('/cart');
    },

    add(productId: string, quantity: number) {
        return api.post('/cart/addProduct', { productId, quantity });
    },

    /** quantity === 0 на бэкенде означает удаление позиции. */
    changeQuantity(cartItemId: string, quantity: number) {
        return api.patch('/cart', { cartItemId, quantity });
    },

    remove(cartItemId: string) {
        return api.delete<{ message: string }>(`/cart/${cartItemId}`);
    },
};
