export interface IOrderItem {
    productId: string;
    quantity: number;
}

export interface IOrder {
    items: IOrderItem[];
}