import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";
import { API_URL } from "../../http";
import { observer } from "mobx-react-lite";
import './Cart.css'

export default observer(function Cart() {

    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            try {
                setLoading(true);
                await store.getCart();
            } catch(error: any) {
                setError(error.response.data.message || 'Не удалось загрузить корзину');
            } finally {
                setLoading(false);
            }
        }
        
       fetchCart();
    }, []);

    if (loading) {
        return <h2>Загрузка корзины...</h2>;
    }

    if (store.cart && store.cart?.items.length === 0) {
        return <h2>Корзина пустая</h2>;
    }

    return (
        <div className='cart-container'>
        <h1 className='cart-title'>Корзина</h1>
        {
            error && (
                <ErrorMessage errorMessage={error} />
            )
        }

        {
            store.cart?.items.map(item => (
                <div className='cart-item' key={item.id}>                    
                    <img src={`${API_URL}${item.product.imageUrl}`} alt={item.product.name} className='cartItem-image' />                    
                    <div className='cart-info'>
                        <h2>{item.product.name}</h2>
                        <p className='cart-price'>{item.product.price}</p>
                        <div className='quantity-controls'>
                            <button onClick={async () => { 
                                try { 
                                    await store.changeQuantityOfProduct(item.id, item.quantity - 1) 
                                } catch(error: any) {
                                    setError(error.response.data.message || 'Не удалось изменить количество')
                                }
                                }}>
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button disabled={item.quantity >= item.product.stock} onClick={async () => { 
                                try {
                                    await store.changeQuantityOfProduct(item.id, item.quantity + 1) 
                                } catch(error: any) {
                                    setError(error.response.data.message || 'Не удалось изменить количество')
                                }
                                }}>
                                +
                            </button>
                        </div>
                    </div>

                    
                    <button className='delete-button' onClick={() => { store.deleteCartItem(item.id) }}>
                        <img src={`${API_URL}/uploads/delete.jpg`} alt='Удалить' />                        
                    </button>
                </div>
            ))
        }
        </div>
    )
})