import { makeAutoObservable, runInAction } from 'mobx';
import { ProductsApi } from '../api/products.api';
import type { IProduct } from '../models';

export class CatalogStore {
    products: IProduct[] = [];
    total = 0;
    totalPages = 1;
    isLoading = false;

    /** Непустая строка означает, что показан результат поиска, а не страница каталога. */
    query = '';

    constructor() {
        makeAutoObservable(this);
    }

    async loadPage(page: number, limit: number) {
        this.isLoading = true;

        try {
            const { data } = await ProductsApi.getPage(page, limit);
            runInAction(() => {
                this.products = data.products;
                this.total = data.total;
                this.totalPages = Math.max(1, data.totalPages);
                this.query = '';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async search(query: string) {
        this.isLoading = true;

        try {
            const { data } = await ProductsApi.search(query);
            runInAction(() => {
                this.products = data;
                this.total = data.length;
                this.totalPages = 1;
                this.query = query;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    /** Локально убирает удалённый товар, чтобы не перезапрашивать всю страницу. */
    removeLocally(productId: string) {
        this.products = this.products.filter((product) => product.id !== productId);
        this.total = Math.max(0, this.total - 1);
    }
}
