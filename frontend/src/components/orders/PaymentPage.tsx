import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { OrdersApi } from '../../api/orders.api';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import type { IPaymentDetails } from '../../models';
import { Alert, Loader, StateBlock } from '../ui';

export function PaymentPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<IPaymentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [payError, setPayError] = useState('');
    const [busy, setBusy] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!orderId) {
                return;
            }

            try {
                const { data } = await OrdersApi.getPaymentDetails(orderId);
                if (!cancelled) {
                    setDetails(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(getErrorMessage(err, 'Не удалось получить реквизиты'));
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

    async function confirmPaid() {
        if (!orderId) {
            return;
        }

        setPayError('');
        setBusy(true);

        try {
            await OrdersApi.notifyPayment(orderId);
            navigate('/profile/me', { replace: true });
        } catch (err) {
            setPayError(getErrorMessage(err, 'Не удалось отправить подтверждение'));
        } finally {
            setBusy(false);
        }
    }

    async function copyCard() {
        if (!details) {
            return;
        }

        try {
            await navigator.clipboard.writeText(details.cardNumber.replace(/\s/g, ''));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Буфер обмена недоступен (нет https / отказ пользователя) — не критично.
        }
    }

    if (loading) {
        return <Loader text="Загружаем реквизиты..." />;
    }

    if (loadError || !details) {
        return (
            <StateBlock
                icon="💳"
                title="Реквизиты недоступны"
                text={loadError || 'Заказ уже оплачен или отменён.'}
                action={
                    <Link to="/profile/me" className="btn btn--secondary">
                        К моим заказам
                    </Link>
                }
            />
        );
    }

    return (
        <div className="pay-card">
            <div className="page-head">
                <h1>Оплата заказа</h1>
            </div>

            <div className="panel stack">
                <Alert kind="info">
                    Переведите сумму на карту ниже, затем нажмите «Я оплатил». Администратор
                    проверит поступление и подтвердит заказ.
                </Alert>

                <div>
                    <div className="pay-row">
                        <span className="pay-row__label">Банк</span>
                        <span className="pay-row__value">{details.bankName}</span>
                    </div>
                    <div className="pay-row">
                        <span className="pay-row__label">Получатель</span>
                        <span className="pay-row__value">{details.receiverName}</span>
                    </div>
                    <div className="pay-row">
                        <span className="pay-row__label">Номер карты</span>
                        <span className="row">
                            <span className="pay-row__value">{details.cardNumber}</span>
                            <button type="button" className="btn btn--ghost btn--sm" onClick={copyCard}>
                                {copied ? '✓ Скопировано' : 'Копировать'}
                            </button>
                        </span>
                    </div>
                    <div className="pay-row pay-row--total">
                        <span className="pay-row__label">Сумма к оплате</span>
                        <span className="pay-row__value">{formatPrice(details.amountToPay)}</span>
                    </div>
                </div>

                <Alert kind="info">{details.instruction}</Alert>

                {payError && <Alert>{payError}</Alert>}

                <button type="button" className="btn btn--block btn--lg" onClick={confirmPaid} disabled={busy}>
                    {busy ? 'Отправляем...' : '✓ Я оплатил заказ'}
                </button>

                <Link to="/profile/me" className="btn btn--ghost btn--block">
                    Оплатить позже
                </Link>
            </div>
        </div>
    );
}
