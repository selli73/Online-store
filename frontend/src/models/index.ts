// Типы, зеркалящие контракт бэкенда (см. backend/prisma/schema.prisma и DTO контроллеров).

export type Role = 'USER' | 'ADMIN';

export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'CANCELLED'
    | 'SHIPPED'
    | 'AWAITING_CONFIRMATION';

/** То, что кладёт в request.user JwtStrategy, и что отдаёт GET /profile/me. */
export interface IUser {
    userId: string;
    email: string;
    role: Role;
}

export interface IAuthResponse {
    access_token: string;
}

export interface IProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    applicabilityToCars: string;
    partType: string;
    manufacturer: string | null;
    description: string | null;
    imageUrl: string | null;
    rating: number;
    isDeleted: boolean;
}

/** Ответ GET /product/all?page=&limit= */
export interface IProductsPage {
    products: IProduct[];
    total: number;
    totalPages: number;
}

/** Тело POST /product и PUT /product/:id (для PUT все поля опциональны). */
export interface IProductInput {
    name: string;
    price: number;
    stock: number;
    applicabilityToCars: string;
    partType: string;
    manufacturer?: string;
    description?: string;
}

export interface ICartItem {
    id: string;
    quantity: number;
    productId: string;
    cartId: string;
    product: IProduct;
}

/** GET /cart отдаёт корзину с items, либо `{ items: [] }`, если корзины ещё нет. */
export interface ICart {
    id?: string;
    userId?: string;
    items: ICartItem[];
}

export interface IOrderSummary {
    id: string;
    orderNumber: number;
    total: number;
    status: OrderStatus;
    paymentMethod: string;
    userId: string;
}

/** Ответ GET /orders/:id — бэкенд отдаёт срез полей, без `id`. */
export interface IOrderDetails {
    userId: string;
    orderNumber: number;
    total: number;
    status: OrderStatus;
    items: {
        price: number;
        quantity: number;
        product: {
            id: string;
            name: string;
            rating: number;
            imageUrl: string | null;
        };
    }[];
}

export interface IOrderAwaitingConfirmation {
    id: string;
    orderNumber: number;
    total: number;
    status: OrderStatus;
    user: {
        name: string | null;
        email: string;
        phone: string | null;
    };
    items: {
        product: {
            name: string;
            imageUrl: string | null;
        };
    }[];
}

export interface IPaymentDetails {
    cardNumber: string;
    receiverName: string;
    bankName: string;
    amountToPay: number;
    instruction: string;
}

/** Тело POST /orders */
export interface ICreateOrder {
    items: { productId: string; quantity: number }[];
}

export interface IReviewInput {
    rating: number;
    productId: string;
    text?: string;
}
