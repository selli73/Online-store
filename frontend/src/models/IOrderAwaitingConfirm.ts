
export default interface IOrdersAwaitingConfirm {
    orders: IOrderAwaitingConfrim[]
}

interface IOrderAwaitingConfrim {
    id: string;
    orderNumber: number;
    total: number;
    status: OrderStatus;
    items: {
        product: {
            name: string;
            imageUrl: string | null;
        }
    }[];
    user: {
        name: string | null;
        email: string;
        phone: string | null;
    }
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED' | 'AWAITING_CONFIRMATIO';