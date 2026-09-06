import api from './client';
import type {
    ICreateOrder,
    IOrderAwaitingConfirmation,
    IOrderDetails,
    IOrderSummary,
    IPaymentDetails,
} from '../models';

export const OrdersApi = {
    getMine() {
        return api.get<IOrderSummary[]>('/orders');
    },

    getById(orderId: string) {
        return api.get<IOrderDetails>(`/orders/${orderId}`);
    },

    create(dto: ICreateOrder) {
        return api.post<IOrderSummary>('/orders', dto);
    },

    getPaymentDetails(orderId: string) {
        return api.get<IPaymentDetails>(`/orders/${orderId}/payment-details`);
    },

    notifyPayment(orderId: string) {
        return api.patch<IOrderSummary>(`/orders/${orderId}/notify-payment`);
    },

    getAwaitingConfirmation() {
        return api.get<{ orders: IOrderAwaitingConfirmation[] }>('/orders/admin/awaitingConfirmation');
    },

    confirmPayment(orderId: string) {
        return api.patch<IOrderSummary>(`/orders/${orderId}/confirm-payment`);
    },
};
