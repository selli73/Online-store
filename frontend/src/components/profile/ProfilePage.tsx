import { observer } from 'mobx-react-lite';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersApi } from '../../api/orders.api';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice, orderStatusLabel, orderStatusTone } from '../../lib/format';
import type { IOrderSummary } from '../../models';
import { Alert, Loader, StateBlock } from '../ui';

export const ProfilePage = observer(function ProfilePage() {
    const { auth, cart } = useStore();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<IOrderSummary[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState('');

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const { data } = await OrdersApi.getMine();
                if (!cancelled) {
                    // Свежие заказы сверху.
                    setOrders([...data].sort((a, b) => b.orderNumber - a.orderNumber));
                }
            } catch (err) {
                if (!cancelled) {
                    setOrdersError(getErrorMessage(err, 'Не удалось загрузить заказы'));
                }
            } finally {
                if (!cancelled) {
                    setOrdersLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleChangePassword(event: FormEvent) {
        event.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setSavingPassword(true);

        try {
            await auth.changePassword(oldPassword, newPassword);
            setPasswordSuccess('Пароль изменён');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordError(getErrorMessage(err, 'Не удалось сменить пароль'));
        } finally {
            setSavingPassword(false);
        }
    }

    function handleLogout() {
        auth.logout();
        cart.reset();
        navigate('/login', { replace: true });
    }

    return (
        <>
            <div className="page-head">
                <h1>Мой профиль</h1>
            </div>

            <div className="profile-layout">
                <div className="stack">
                    <section className="panel">
                        <h2>Аккаунт</h2>

                        <div style={{ marginTop: 12 }}>
                            <div className="info-row">
                                <span className="info-row__label">Email</span>
                                <span className="info-row__value">{auth.user?.email ?? '—'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-row__label">Роль</span>
                                <span className="info-row__value">
                                    <span className={`badge ${auth.isAdmin ? 'badge--info' : ''}`}>
                                        {auth.isAdmin ? 'Администратор' : 'Покупатель'}
                                    </span>
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-row__label">ID</span>
                                <span className="info-row__value faint">{auth.user?.userId ?? '—'}</span>
                            </div>
                        </div>

                        <div className="row" style={{ marginTop: 16 }}>
                            <button
                                type="button"
                                className="btn btn--secondary btn--sm"
                                onClick={() => setShowPasswordForm((value) => !value)}
                            >
                                {showPasswordForm ? 'Скрыть' : 'Сменить пароль'}
                            </button>
                            <button type="button" className="btn btn--danger btn--sm" onClick={handleLogout}>
                                Выйти
                            </button>
                        </div>
                    </section>

                    {showPasswordForm && (
                        <form className="panel stack" onSubmit={handleChangePassword}>
                            <h2>Смена пароля</h2>

                            {passwordError && <Alert>{passwordError}</Alert>}
                            {passwordSuccess && <Alert kind="success">{passwordSuccess}</Alert>}

                            <div className="field">
                                <label className="field__label" htmlFor="old-password">
                                    Текущий пароль
                                </label>
                                <input
                                    id="old-password"
                                    className="input"
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="current-password"
                                    value={oldPassword}
                                    onChange={(event) => setOldPassword(event.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label className="field__label" htmlFor="new-password">
                                    Новый пароль
                                </label>
                                <input
                                    id="new-password"
                                    className="input"
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                />
                                <span className="field__hint">Не короче 8 символов</span>
                            </div>

                            <button type="submit" className="btn" disabled={savingPassword}>
                                {savingPassword ? 'Сохраняем...' : 'Сохранить'}
                            </button>
                        </form>
                    )}
                </div>

                <section className="panel">
                    <h2>Мои заказы</h2>

                    {ordersError && (
                        <div style={{ marginTop: 12 }}>
                            <Alert>{ordersError}</Alert>
                        </div>
                    )}

                    {ordersLoading && <Loader text="Загружаем заказы..." />}

                    {!ordersLoading && !ordersError && orders.length === 0 && (
                        <StateBlock icon="🧾" title="Заказов пока нет" text="Оформите первый заказ в каталоге." />
                    )}

                    {!ordersLoading && orders.length > 0 && (
                        <div className="order-list" style={{ marginTop: 14 }}>
                            {orders.map((order) => (
                                <button
                                    type="button"
                                    className="order-row"
                                    key={order.id}
                                    onClick={() => navigate(`/order/${order.id}/info`)}
                                >
                                    <div className="stack--sm">
                                        <strong>Заказ №{order.orderNumber}</strong>
                                        <span className="faint">{formatPrice(order.total)}</span>
                                    </div>

                                    <span className="spacer" />

                                    <span className={`badge ${orderStatusTone(order.status)}`}>
                                        {orderStatusLabel(order.status)}
                                    </span>

                                    <span className="faint" aria-hidden="true">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
});
