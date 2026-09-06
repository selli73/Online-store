import { makeAutoObservable, runInAction } from 'mobx';
import { CartApi } from '../api/cart.api';
import type { ICart, ICartItem } from '../models';

export class CartStore {
    cart: ICart | null = null;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    get items(): ICartItem[] {
        return this.cart?.items ?? [];
    }

    /** Число позиций в корзине — для бейджа в шапке. */
    get count(): number {
        return this.items.length;
    }

    async load() {
        this.isLoading = true;

        try {
            const { data } = await CartApi.get();
            runInAction(() => {
                this.cart = data;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async add(productId: string, quantity: number) {
        await CartApi.add(productId, quantity);
        await this.load();
    }

    async changeQuantity(cartItemId: string, quantity: number) {
        await CartApi.changeQuantity(cartItemId, quantity);
        await this.load();
    }

    async remove(cartItemId: string) {
        await CartApi.remove(cartItemId);
        await this.load();
    }

    reset() {
        this.cart = null;
    }
}
