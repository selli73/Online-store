import type { OrderStatus } from '../models';
import { API_URL } from '../api/client';

export function formatPrice(value: number | null | undefined): string {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return '—';
    }
    return `${value.toLocaleString('ru-RU')} \u20BD`;
}

export function formatRating(rating: number | null | undefined): string {
    if (typeof rating !== 'number' || rating <= 0) {
        return 'нет оценок';
    }
    return rating.toFixed(1);
}

/**
 * Бэкенд хранит путь вида `/uploads/<file>`, а nginx проксирует `/api/` на корень
 * бэкенда, поэтому картинка доступна по `${API_URL}${imageUrl}`.
 */
export function resolveImageUrl(imageUrl: string | null | undefined): string | null {
    if (!imageUrl) {
        return null;
    }
    if (/^https?:\/\//.test(imageUrl)) {
        return imageUrl;
    }
    return `${API_URL}${imageUrl}`;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Ожидает оплаты',
    AWAITING_CONFIRMATION: 'Оплата на проверке',
    PAID: 'Оплачен',
    SHIPPED: 'Отправлен',
    CANCELLED: 'Отменён',
};

export function orderStatusLabel(status: OrderStatus): string {
    return ORDER_STATUS_LABELS[status] ?? status;
}

/** CSS-модификатор для бейджа статуса. */
export function orderStatusTone(status: OrderStatus): string {
    switch (status) {
        case 'PAID':
        case 'SHIPPED':
            return 'badge--success';
        case 'AWAITING_CONFIRMATION':
            return 'badge--info';
        case 'CANCELLED':
            return 'badge--danger';
        default:
            return 'badge--warning';
    }
}
