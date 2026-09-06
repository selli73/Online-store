import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OrdersApi } from '../../api/orders.api';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import { Alert, ConfirmDialog, Loader, StateBlock, Thumb } from '../ui';

export const CartPage = observer(function CartPage() {
    const { cart } = useStore();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [pendingItemId, setPendingItemId] = useState<string | null>(null);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                await cart.load();
            } catch (err) {
                if (!cancelled) {
                    setError(getErrorMessage(err, 'Не удалось загрузить корзину'));
                }
            } finally {
                if (!cancelled) {
                    setInitialLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [cart]);

    const items = cart.items;

    // Убираем из выбранных то, чего в корзине больше нет (удалили позицию,
    // товар сняли с продажи и т.п.) — иначе в заказ уедет несуществующий id.
    useEffect(() => {
        setSelected((current) => current.filter((id) => items.some((item) => item.id === id)));
    }, [items]);

    const selectedItems = useMemo(
        () => items.filter((item) => selected.includes(item.id)),
        [items, selected],
    );

    const totalCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const allSelected = items.length > 0 && selected.length === items.length;

    function toggle(itemId: string) {
        setSelected((current) =>
            current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
        );
    }

    function toggleAll() {
        setSelected(allSelected ? [] : items.map((item) => item.id));
    }

    async function changeQuantity(itemId: string, quantity: number) {
        setError('');
        setPendingItemId(itemId);

        try {
            await cart.changeQuantity(itemId, quantity);
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось изменить количество'));
        } finally {
            setPendingItemId(null);
        }
    }

    async function removeItem(itemId: string) {
        setError('');
        setPendingItemId(itemId);

        try {
            await cart.remove(itemId);
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось удалить товар'));
        } finally {
            setPendingItemId(null);
            setItemToRemove(null);
        }
    }

    async function checkout() {
        setError('');
        setCheckingOut(true);

        try {
            const { data: order } = await OrdersApi.create({
                items: selectedItems.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
            });

            await cart.load().catch(() => undefined);
            navigate(`/orders/${order.id}/payment`);
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось оформить заказ'));
        } finally {
            setCheckingOut(false);
        }
    }

    if (initialLoading) {
        return <Loader text="Загружаем корзину..." />;
    }

    if (items.length === 0) {
        return (
            <StateBlock
                icon="🛒"
                title="Корзина пуста"
                text="Добавьте товары из каталога, чтобы оформить заказ."
                action={
                    <Link to="/products" className="btn">
                        Перейти в каталог
                    </Link>
                }
            />
        );
    }

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Корзина</h1>
                    <p className="page-head__sub">{items.length} поз. в корзине</p>
                </div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={toggleAll}>
                    {allSelected ? 'Снять выделение' : 'Выбрать всё'}
                </button>
            </div>

            {error && (
                <div style={{ marginBottom: 16 }}>
                    <Alert>{error}</Alert>
                </div>
            )}

            <div className="cart-layout">
                <div className="stack--sm">
                    {items.map((item) => {
                        const busy = pendingItemId === item.id;

                        return (
                            <div className="cart-item" key={item.id}>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    checked={selected.includes(item.id)}
                                    onChange={() => toggle(item.id)}
                                    aria-label={`Выбрать ${item.product.name}`}
                                />

                                <Link to={`/product/${item.product.id}`}>
                                    <Thumb src={item.product.imageUrl} alt={item.product.name} />
                                </Link>

                                <div className="stack--sm">
                                    <Link to={`/product/${item.product.id}`} className="cart-item__name">
                                        {item.product.name}
                                    </Link>
                                    <span className="muted">{formatPrice(item.product.price)} за шт.</span>

                                    <div className="row">
                                        <div className="qty">
                                            <button
                                                type="button"
                                                onClick={() => changeQuantity(item.id, item.quantity - 1)}
                                                disabled={busy || item.quantity <= 1}
                                                aria-label="Уменьшить количество"
                                            >
                                                −
                                            </button>
                                            <span className="qty__value">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => changeQuantity(item.id, item.quantity + 1)}
                                                disabled={busy || item.quantity >= item.product.stock}
                                                aria-label="Увеличить количество"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {item.quantity >= item.product.stock && (
                                            <span className="faint">Больше нет на складе</span>
                                        )}
                                    </div>
                                </div>

                                <div className="stack--sm text-right">
                                    <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                                    <button
                                        type="button"
                                        className="btn btn--danger btn--sm"
                                        onClick={() => setItemToRemove(item.id)}
                                        disabled={busy}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <aside className="panel summary">
                    <h2>Итого</h2>

                    <div className="stack--sm" style={{ marginTop: 14 }}>
                        <div className="summary__row">
                            <span>Позиций выбрано</span>
                            <span>{selectedItems.length}</span>
                        </div>
                        <div className="summary__row">
                            <span>Товаров, шт.</span>
                            <span>{totalCount}</span>
                        </div>
                        <div className="summary__total">
                            <span>К оплате</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn--block btn--lg"
                            disabled={selectedItems.length === 0 || checkingOut}
                            onClick={checkout}
                        >
                            {checkingOut ? 'Оформляем...' : 'Перейти к оформлению'}
                        </button>

                        {selectedItems.length === 0 && (
                            <p className="faint">Отметьте товары, которые хотите заказать.</p>
                        )}
                    </div>
                </aside>
            </div>

            {itemToRemove && (
                <ConfirmDialog
                    title="Удалить товар?"
                    message="Позиция будет удалена из корзины."
                    busy={pendingItemId === itemToRemove}
                    onConfirm={() => void removeItem(itemToRemove)}
                    onCancel={() => setItemToRemove(null)}
                />
            )}
        </>
    );
});
