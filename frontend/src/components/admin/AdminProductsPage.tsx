import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductsApi } from '../../api/products.api';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import type { IProduct } from '../../models';
import { Alert, ConfirmDialog, Loader, Pagination, StateBlock, Thumb } from '../ui';

const LIMIT = 12;

export const AdminProductsPage = observer(function AdminProductsPage() {
    const { catalog } = useStore();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const [error, setError] = useState('');
    const [toDelete, setToDelete] = useState<IProduct | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setError('');

            try {
                await catalog.loadPage(page, LIMIT);
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
    }, [catalog, page]);

    async function confirmDelete() {
        if (!toDelete) {
            return;
        }

        setDeleting(true);
        setError('');

        try {
            await ProductsApi.remove(toDelete.id);
            catalog.removeLocally(toDelete.id);
            setToDelete(null);

            // Удалили последний товар на странице — отступаем на предыдущую.
            if (catalog.products.length === 0 && page > 1) {
                setSearchParams({ page: String(page - 1) });
            }
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось удалить товар'));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Управление товарами</h1>
                    <p className="page-head__sub">Всего товаров: {catalog.total}</p>
                </div>
                <Link to="/admin/products/create" className="btn">
                    + Создать товар
                </Link>
            </div>

            {error && (
                <div style={{ marginBottom: 16 }}>
                    <Alert>{error}</Alert>
                </div>
            )}

            {catalog.isLoading && <Loader text="Загружаем товары..." />}

            {!catalog.isLoading && catalog.products.length === 0 && (
                <StateBlock
                    icon="📦"
                    title="Товаров нет"
                    text="Создайте первый товар, чтобы он появился в каталоге."
                    action={
                        <Link to="/admin/products/create" className="btn">
                            Создать товар
                        </Link>
                    }
                />
            )}

            {!catalog.isLoading && catalog.products.length > 0 && (
                <>
                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Наименование</th>
                                    <th>Тип детали</th>
                                    <th>Цена</th>
                                    <th>Остаток</th>
                                    <th>Рейтинг</th>
                                    <th aria-label="Действия" />
                                </tr>
                            </thead>
                            <tbody>
                                {catalog.products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <Thumb src={product.imageUrl} alt={product.name} />
                                        </td>
                                        <td>
                                            <strong>{product.name}</strong>
                                            <div className="faint">{product.manufacturer || 'без бренда'}</div>
                                        </td>
                                        <td className="muted">{product.partType}</td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>
                                            <span className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
                                                {product.stock} шт.
                                            </span>
                                        </td>
                                        <td className="muted">
                                            {product.rating > 0 ? product.rating.toFixed(1) : '—'}
                                        </td>
                                        <td>
                                            <div className="row">
                                                <button
                                                    type="button"
                                                    className="btn btn--secondary btn--sm"
                                                    onClick={() =>
                                                        navigate(`/admin/products/edit/${product.id}`)
                                                    }
                                                >
                                                    Изменить
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn--danger btn--sm"
                                                    onClick={() => setToDelete(product)}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={page}
                        totalPages={catalog.totalPages}
                        onChange={(next) => setSearchParams({ page: String(next) })}
                    />
                </>
            )}

            {toDelete && (
                <ConfirmDialog
                    title="Удаление товара"
                    message={`Товар «${toDelete.name}» будет скрыт из каталога. Продолжить?`}
                    busy={deleting}
                    onConfirm={() => void confirmDelete()}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </>
    );
});
