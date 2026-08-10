import { useNavigate } from "react-router-dom";
import type IProduct from "../../../models/IProduct";
import './ProductList.css';
import { use, useContext, useEffect, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import ErrorMessage from "../../Error/ErrorMessage";
import { Context } from "../../../main";

type ProductListProps = {
    products: IProduct[];
    onDelete: (product: IProduct) => void;
};



export function ProductList({ products, onDelete }: ProductListProps) {
    
    const { store } = useContext(Context);
    const navigate = useNavigate();    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const limit = 12;
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
    
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                await store.getAllProducts(page, limit);
                console.log(store.products.length);
            } catch(error: any) {
                setError(error?.response?.data?.message || 'Не удалось загрузить товары');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [page]);

    function handleConfirmDelete() {
        try {
            if (!productToDelete) return;
            onDelete(productToDelete);            
            setProductToDelete(null);
            
            if (store.products.length === 0 && page > 1) {
                setPage(prev => prev - 1);
            }

        } catch(error: any) {
            setError(error?.response?.data?.message || 'Не удалось удалить товар')
        }
    }

    if (error) {
        return <ErrorMessage errorMessage={error}/>;
    }

    if (loading) {
        return <h2>Загрузка товаров...</h2>;
    }


    return (
        <div className='products-list'>
            {
                products.map(product => (
                    <div className='admin-product-card' key={product.id}>
                        <img className='product-image' src={`${import.meta.env.VITE_API_BACKEND_URL}${product.imageUrl}`} alt={product.name}></img>                              
                            <p className='product-price'>{product.price} руб.</p>
                            <h5>{product.name}</h5>                            
                            <p>
                                Остаток: {product.stock}
                            </p>                
                        <div className='product-actions'>
                            <button onClick={() => navigate(`/admin/products/edit/${product.id}`)}>Изменить</button>
                            <button onClick={() => setProductToDelete(product)}>Удалить</button>
                        </div>
                    </div>
                ))
            }

            
            <div className='pagination'>
                <button disabled={page===1} onClick={() => setPage(page - 1)}>
                    Назад
                </button>

                <span>Страница {page}</span>

                <button disabled={page === store.totalPage} onClick={() => setPage(page + 1)}>
                    Вперёд
                </button>
            </div>
            

            {
                productToDelete && (
                    <ConfirmDialog
                        title='Удаление товара'
                        message={`Вы уверены, что хотите удалить товар "${productToDelete.name}"? Это действие нельзя отменить.`}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setProductToDelete(null)}
                    />
                )
            }
        </div>
    )
}