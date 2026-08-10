import { useContext, useEffect, useState } from "react"
import { Context } from "../../../main"
import ErrorMessage from "../../Error/ErrorMessage";
import { ProductList } from "./ProductList";
import { observer } from "mobx-react-lite";
import type IProduct from "../../../models/IProduct";
import { useNavigate } from "react-router-dom";
import './AdminPanel.css';

export const AdminProducts = observer(() => {
    
    const { store } = useContext(Context);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showProducts, setShowProducts] = useState(false);
    const limit = 12;
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                await store.getAllProducts(page, limit);
            } catch(error: any) {
                setError(error.response.data.message || 'Не удалось загрузить товары');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [page]);

    if (error) {
        return <ErrorMessage errorMessage={error} />
    }

    if (loading) {
        return ( <h2>Загрузка товаров...</h2> )
    }

    async function handleDelete(product: IProduct) {
        try {
            await store.deleteProduct(product.id);
        } catch(error: any) {
            setError(error.response.data.message || 'Не удалось удалить товар')
        }
    }

    return (
        <div className='admin-products'>

            <div className='admin-header'>
                <h1>Управление товарами</h1>
                <button onClick={() => navigate('create')}>
                    + Создать товар
                </button>
            </div>
            <ProductList products={store.products} onDelete={handleDelete} />
        </div>
    )
})