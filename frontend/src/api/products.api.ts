import api from './client';
import type { IProduct, IProductInput, IProductsPage } from '../models';

export const ProductsApi = {
    /** `page` и `limit` обязательны: на бэкенде они проходят через ParseIntPipe. */
    getPage(page: number, limit: number) {
        return api.get<IProductsPage>('/product/all', { params: { page, limit } });
    },

    getById(id: string) {
        return api.get<IProduct>(`/product/${id}`);
    },

    search(query: string) {
        return api.get<IProduct[]>('/product/search', { params: { query } });
    },

    create(dto: IProductInput) {
        return api.post<IProduct>('/product', dto);
    },

    update(id: string, dto: Partial<IProductInput>) {
        return api.put<IProduct>(`/product/${id}`, dto);
    },

    remove(id: string) {
        return api.delete<IProduct>(`/product/${id}`);
    },

    uploadImage(id: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return api.post<{ message: string; imageUrl: string }>(`/product/${id}/image`, formData);
    },
};
