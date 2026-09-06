import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductsApi } from '../../api/products.api';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import type { IProduct } from '../../models';
import { Alert, Loader, Rating, StateBlock, Thumb } from '../ui';

export function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const { cart } = useStore();

    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [quantity, setQuantity] = useState(1);
    const [cartError, setCartError] = useState('');
    const [added, setAdded] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) {
                return;
            }

            setLoading(true);
            setLoadError('');

            try {
                const { data } = await ProductsApi.getById(id);
                if (!cancelled) {
                    setProduct(data);
                    setQuantity(1);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(getErrorMessage(err, 'Не удалось загрузить товар'));
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
    }, [id]);

    async function handleAddToCart() {
        if (!product) {
            return;
        }

        setCartError('');
        setAdded(false);
        setBusy(true);

        try {
            await cart.add(product.id, quantity);
            setAdded(true);
        } catch (err) {
            setCartError(getErrorMessage(err, 'Не удалось добавить товар в корзину'));
        } finally {
            setBusy(false);
        }
    }

    if (loading) {
        return <Loader text="Загружаем товар..." />;
    }

    if (loadError || !product) {
        return (
            <StateBlock
                icon="🔍"
                title="Товар недоступен"
                text={loadError || 'Такого товара не существует.'}
                action={
                    <Link to="/products" className="btn btn--secondary">
                        Вернуться в каталог
                    </Link>
                }
            />
        );
    }

    const outOfStock = product.stock <= 0;

    return (
        <>
            <div className="page-head">
                <Link to="/products" className="btn btn--ghost btn--sm">
                    ← Назад в каталог
                </Link>
            </div>

            <div className="product-page">
                <Thumb src={product.imageUrl} alt={product.name} />

                <div className="stack">
                    <div className="stack--sm">
                        <h1>{product.name}</h1>
                        <div className="row row--wrap">
                            <Rating value={product.rating} />
                            <span className={outOfStock ? 'stock-out' : 'stock-ok'}>
                                {outOfStock ? '✖ Нет в наличии' : `✔ В наличии: ${product.stock} шт.`}
                            </span>
                        </div>
                    </div>

                    <div className="product-page__price">{formatPrice(product.price)}</div>

                    <dl className="spec-list">
                        <div className="spec-list__row">
                            <dt>Тип детали</dt>
                            <dd>{product.partType}</dd>
                        </div>
                        <div className="spec-list__row">
                            <dt>Применимость к авто</dt>
                            <dd>{product.applicabilityToCars}</dd>
                        </div>
                        <div className="spec-list__row">
                            <dt>Производитель</dt>
                            <dd>{product.manufacturer || '—'}</dd>
                        </div>
                    </dl>

                    {product.description && (
                        <div className="stack--sm">
                            <h3>Описание</h3>
                            <p className="muted">{product.description}</p>
                        </div>
                    )}

                    {cartError && <Alert>{cartError}</Alert>}
                    {added && (
                        <Alert kind="success">
                            Товар добавлен в корзину. <Link to="/cart">Перейти в корзину →</Link>
                        </Alert>
                    )}

                    <div className="row row--wrap">
                        <div className="qty">
                            <button
                                type="button"
                                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                disabled={quantity <= 1 || outOfStock}
                                aria-label="Уменьшить количество"
                            >
                                −
                            </button>
                            <span className="qty__value">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                                disabled={quantity >= product.stock || outOfStock}
                                aria-label="Увеличить количество"
                            >
                                +
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn btn--lg"
                            onClick={handleAddToCart}
                            disabled={outOfStock || busy}
                        >
                            {busy ? 'Добавляем...' : 'Добавить в корзину'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
