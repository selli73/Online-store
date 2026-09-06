import { observer } from 'mobx-react-lite';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import { Alert, Loader, Pagination, Rating, StateBlock, Thumb } from '../ui';

const LIMIT = 12;

export const ProductsPage = observer(function ProductsPage() {
    const { catalog } = useStore();

    // Страница и поисковый запрос живут в URL — ссылку можно скопировать,
    // а кнопка «назад» в браузере работает предсказуемо.
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const query = searchParams.get('query') ?? '';

    const [draftQuery, setDraftQuery] = useState(query);
    const [error, setError] = useState('');

    useEffect(() => {
        setDraftQuery(query);
    }, [query]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError('');

            try {
                if (query.trim()) {
                    await catalog.search(query.trim());
                } else {
                    await catalog.loadPage(page, LIMIT);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(getErrorMessage(err, 'Не удалось загрузить товары'));
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [catalog, page, query]);

    function handleSearch(event: FormEvent) {
        event.preventDefault();
        const next = draftQuery.trim();

        setSearchParams(next ? { query: next } : {}, { replace: false });
    }

    function resetSearch() {
        setDraftQuery('');
        setSearchParams({});
    }

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Каталог автозапчастей</h1>
                    <p className="page-head__sub">
                        {query ? `Результаты поиска: «${query}»` : 'Все товары в наличии'}
                        {catalog.total > 0 && ` · найдено ${catalog.total}`}
                    </p>
                </div>
            </div>

            <form className="catalog-toolbar" onSubmit={handleSearch}>
                <input
                    className="input"
                    type="search"
                    placeholder="Поиск по названию, марке авто, производителю..."
                    value={draftQuery}
                    onChange={(event) => setDraftQuery(event.target.value)}
                />
                <button type="submit" className="btn">
                    Найти
                </button>
                {query && (
                    <button type="button" className="btn btn--secondary" onClick={resetSearch}>
                        Сбросить
                    </button>
                )}
            </form>

            {error && <Alert>{error}</Alert>}

            {catalog.isLoading && <Loader text="Загружаем товары..." />}

            {!catalog.isLoading && !error && catalog.products.length === 0 && (
                <StateBlock
                    icon="📦"
                    title={query ? 'Ничего не найдено' : 'Товаров пока нет'}
                    text={query ? 'Попробуйте изменить запрос.' : 'Загляните позже.'}
                />
            )}

            {!catalog.isLoading && catalog.products.length > 0 && (
                <>
                    <div className="product-grid">
                        {catalog.products.map((product) => (
                            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                                <Thumb src={product.imageUrl} alt={product.name} />

                                <div className="product-card__body">
                                    <span className="product-card__price">{formatPrice(product.price)}</span>
                                    <span className="product-card__name">{product.name}</span>
                                    <span className="faint">{product.partType}</span>

                                    <div className="product-card__meta">
                                        <Rating value={product.rating} />
                                        <span className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
                                            {product.stock > 0 ? '✔ В наличии' : '✖ Нет в наличии'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {!query && (
                        <Pagination
                            page={page}
                            totalPages={catalog.totalPages}
                            onChange={(next) => setSearchParams({ page: String(next) })}
                        />
                    )}
                </>
            )}
        </>
    );
});
