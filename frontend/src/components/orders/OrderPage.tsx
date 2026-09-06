import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { OrdersApi } from '../../api/orders.api';
import { ReviewsApi } from '../../api/reviews.api';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice, orderStatusLabel, orderStatusTone } from '../../lib/format';
import type { IOrderDetails } from '../../models';
import { Alert, Loader, Rating, StarsInput, StateBlock, Thumb } from '../ui';

type ReviewDraft = { rating: number; text: string };

export function OrderPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const [order, setOrder] = useState<IOrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [openReviewFor, setOpenReviewFor] = useState<string | null>(null);
    const [draft, setDraft] = useState<ReviewDraft>({ rating: 5, text: '' });
    const [reviewError, setReviewError] = useState('');
    const [reviewedIds, setReviewedIds] = useState<string[]>([]);
    const [savingReview, setSavingReview] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!orderId) {
                return;
            }

            try {
                const { data } = await OrdersApi.getById(orderId);
                if (!cancelled) {
                    setOrder(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(getErrorMessage(err, 'Не удалось загрузить заказ'));
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
    }, [orderId]);

    function openReview(productId: string) {
        setOpenReviewFor(productId);
        setDraft({ rating: 5, text: '' });
        setReviewError('');
    }

    async function submitReview(productId: string) {
        setReviewError('');
        setSavingReview(true);

        const payload = {
            productId,
            rating: draft.rating,
            text: draft.text.trim() || undefined,
        };

        try {
            await ReviewsApi.create(payload);
            setReviewedIds((current) => [...current, productId]);
            setOpenReviewFor(null);
        } catch (err) {
            // 409 означает, что отзыв уже есть — тогда обновляем существующий.
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                try {
                    await ReviewsApi.change(payload);
                    setReviewedIds((current) => [...current, productId]);
                    setOpenReviewFor(null);
                    return;
                } catch (changeError) {
                    setReviewError(getErrorMessage(changeError, 'Не удалось обновить отзыв'));
                    return;
                } finally {
                    setSavingReview(false);
                }
            }

            setReviewError(getErrorMessage(err, 'Не удалось отправить отзыв'));
        } finally {
            setSavingReview(false);
        }
    }

    if (loading) {
        return <Loader text="Загружаем заказ..." />;
    }

    if (loadError || !order) {
        return (
            <StateBlock
                icon="📄"
                title="Заказ недоступен"
                text={loadError || 'Заказ не найден.'}
                action={
                    <Link to="/profile/me" className="btn btn--secondary">
                        К моим заказам
                    </Link>
                }
            />
        );
    }

    // Отзыв бэкенд принимает только по оплаченным/отправленным заказам.
    const canReview = order.status === 'PAID' || order.status === 'SHIPPED';

    return (
        <>
            <div className="page-head">
                <div>
                    <Link to="/profile/me" className="btn btn--ghost btn--sm">
                        ← К моим заказам
                    </Link>
                    <h1 style={{ marginTop: 10 }}>Заказ №{order.orderNumber}</h1>
                </div>

                <div className="row">
                    <span className={`badge ${orderStatusTone(order.status)}`}>
                        {orderStatusLabel(order.status)}
                    </span>
                    <strong style={{ fontSize: '1.25rem' }}>{formatPrice(order.total)}</strong>
                </div>
            </div>

            {order.status === 'PENDING' && (
                <div style={{ marginBottom: 20 }}>
                    <Alert kind="info">
                        Заказ ещё не оплачен.{' '}
                        <Link to={`/orders/${orderId}/payment`}>Перейти к оплате →</Link>
                    </Alert>
                </div>
            )}

            <h2 style={{ marginBottom: 14 }}>Состав заказа</h2>

            <div className="order-items">
                {order.items.map((item) => {
                    const isReviewed = reviewedIds.includes(item.product.id);
                    const isOpen = openReviewFor === item.product.id;

                    return (
                        <div className="order-item" key={item.product.id}>
                            <Link to={`/product/${item.product.id}`}>
                                <Thumb src={item.product.imageUrl} alt={item.product.name} />
                            </Link>

                            <div className="stack--sm">
                                <Link to={`/product/${item.product.id}`} className="cart-item__name">
                                    {item.product.name}
                                </Link>
                                <Rating value={item.product.rating} />

                                <div className="info-row">
                                    <span className="info-row__label">Цена</span>
                                    <span className="info-row__value">{formatPrice(item.price)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-row__label">Количество</span>
                                    <span className="info-row__value">{item.quantity} шт.</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-row__label">Сумма</span>
                                    <span className="info-row__value">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>

                            {canReview && isReviewed && <Alert kind="success">Отзыв сохранён</Alert>}

                            {canReview && !isReviewed && !isOpen && (
                                <button
                                    type="button"
                                    className="btn btn--secondary btn--sm"
                                    onClick={() => openReview(item.product.id)}
                                >
                                    ★ Оценить товар
                                </button>
                            )}

                            {canReview && isOpen && (
                                <div className="stack--sm">
                                    <StarsInput
                                        value={draft.rating}
                                        onChange={(rating) => setDraft((prev) => ({ ...prev, rating }))}
                                    />

                                    <textarea
                                        className="textarea"
                                        maxLength={1000}
                                        placeholder="Расскажите о товаре — необязательно"
                                        value={draft.text}
                                        onChange={(event) =>
                                            setDraft((prev) => ({ ...prev, text: event.target.value }))
                                        }
                                    />

                                    {reviewError && <Alert>{reviewError}</Alert>}

                                    <div className="row">
                                        <button
                                            type="button"
                                            className="btn btn--sm"
                                            disabled={savingReview}
                                            onClick={() => void submitReview(item.product.id)}
                                        >
                                            {savingReview ? 'Отправляем...' : 'Отправить'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--ghost btn--sm"
                                            disabled={savingReview}
                                            onClick={() => {
                                                setOpenReviewFor(null);
                                                setReviewError('');
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
