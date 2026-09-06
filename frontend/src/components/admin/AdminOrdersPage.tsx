import { useEffect, useState } from 'react';
import { OrdersApi } from '../../api/orders.api';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import type { IOrderAwaitingConfirmation } from '../../models';
import { Alert, Loader, StateBlock, Thumb } from '../ui';

export function AdminOrdersPage() {
    const [orders, setOrders] = useState<IOrderAwaitingConfirmation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingId, setPendingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const { data } = await OrdersApi.getAwaitingConfirmation();
                if (!cancelled) {
                    setOrders(data.orders);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getErrorMessage(err, 'Не удалось загрузить заказы'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, []);

    async function confirm(orderId: string) {
        setError('');
        setPendingId(orderId);

        try {
            await OrdersApi.confirmPayment(orderId);
            // Из списка убираем только после успеха — иначе заказ «исчезнет»,
            // хотя на сервере он так и остался неподтверждённым.
            setOrders((current) => current.filter((order) => order.id !== orderId));
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось подтвердить оплату'));
        } finally {
            setPendingId(null);
        }
    }

    if (loading) {
        return <Loader text="Загружаем заказы..." />;
    }

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Подтверждение оплаты</h1>
                    <p className="page-head__sub">Заказы, по которым покупатель сообщил об оплате</p>
                </div>
                {orders.length > 0 && <span className="badge badge--info">{orders.length} в очереди</span>}
            </div>

            {error && (
                <div style={{ marginBottom: 16 }}>
                    <Alert>{error}</Alert>
                </div>
            )}

            {orders.length === 0 ? (
                <StateBlock
                    icon="✅"
                    title="Очередь пуста"
                    text="Нет заказов, ожидающих подтверждения оплаты."
                />
            ) : (
                <div className="stack">
                    {orders.map((order) => (
                        <article className="admin-order-card" key={order.id}>
                            <div className="row row--between row--wrap">
                                <div>
                                    <h2>Заказ №{order.orderNumber}</h2>
                                    <p className="page-head__sub">
                                        Сумма к зачислению: <strong>{formatPrice(order.total)}</strong>
                                    </p>
                                </div>
                                <span className="badge badge--info">Ожидает подтверждения</span>
                            </div>

                            <div className="admin-order-card__products">
                                {order.items.map((item, index) => (
                                    <div
                                        className="admin-order-card__product"
                                        key={`${item.product.name}-${index}`}
                                    >
                                        <Thumb src={item.product.imageUrl} alt={item.product.name} />
                                        <span>{item.product.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 style={{ marginBottom: 6 }}>Покупатель</h3>
                                <div className="info-row">
                                    <span className="info-row__label">Имя</span>
                                    <span className="info-row__value">{order.user.name || 'не указано'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-row__label">Email</span>
                                    <span className="info-row__value">{order.user.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-row__label">Телефон</span>
                                    <span className="info-row__value">{order.user.phone || 'не указан'}</span>
                                </div>
                            </div>

                            <div className="row">
                                <button
                                    type="button"
                                    className="btn"
                                    disabled={pendingId === order.id}
                                    onClick={() => void confirm(order.id)}
                                >
                                    {pendingId === order.id ? 'Подтверждаем...' : '✓ Подтвердить оплату'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}
