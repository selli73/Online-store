import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";
import './Products.css';
import { API_URL } from "../../http";
import { Link } from "react-router-dom";

export default function Products() {
    
    const { store } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const limit = 12;
    
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

    if (loading) {
        return ( <h2>Загрузка товаров...</h2> )
    }
    
    return (
        <div className='products-container'>
            <div className='products-header'>
                <h1 className='brand-title'>Автомагазин73</h1>
                <Link to='/cart' className='cart-link'>
                    <button>
                        🛒 Перейти в корзину
                        {
                            store.cart && store.cart.items && store.cart.items.length > 0 && (
                                <span className='cart-badge'>{store.cart.items.length}</span>
                            )
                        }
                    </button>
                </Link>
                <Link to='/profile/me' className='cart-link'>
                    <button>
                        👤 Профиль
                    </button>                        
                </Link>
            </div>

            {
                error && (
                    <ErrorMessage errorMessage={error}/>
                )
            }

            <div className='products-grid'>

                {
                    store.products.map(product => (
                        <Link to={`/product/${product.id}`} className='product-link'>
                            <div className='product-card'>
                                <img src={`${API_URL}${product.imageUrl}`} alt={product.name} className='product-image'></img>
                                <p>{product.price} руб.</p>
                                <h2>{product.name}</h2>                                                        
                                <p className='product-rating'>
                                    <span className='star'>★</span>
                                    <span className="rating-value">{product.rating}</span>
                                </p>
                                <p className={product.stock > 0? 'in-stock' : 'out-stock'}>
                                    {product.stock > 0? '✔ В наличии' : '✖ Нет в наличии'}
                                </p>
                            </div>
                        </Link>
                    ))
                }

            </div>

            <div className='pagination'>
                <button disabled={page===1} onClick={() => setPage(page - 1)}>
                    Назад
                </button>

                <span>Страница {page}</span>

                <button disabled={page === store.totalPage} onClick={() => setPage(page + 1)}>
                    Вперёд
                </button>
            </div>

        </div>
    );
}