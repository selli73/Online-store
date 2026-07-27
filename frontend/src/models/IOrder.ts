import type { OrderStatus } from "./IOrderAwaitingConfirm";

export interface IOrderItem {
    productId: string;
    quantity: number;
}

export interface IOrder {
    items: IOrderItem[];
}

export interface IOrderById {
    orderNumber: number;
    total: number;
    status: OrderStatus;
    items: {
        product: {
            id: string;
            name: string;
            imageUrl: string | null;
            rating: number;
        };
        quantity: number;
        price: number;
    }[];
    userId: string;
}