import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";
import { API_URL } from "../../http";
import { observer } from "mobx-react-lite";
import './Cart.css'
import { useNavigate } from "react-router-dom";

export default observer(function Cart() {

    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const navigate = useNavigate();

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

    const selectedProducts = store.cart?.items.filter(item=>selectedItems.includes(item.id));
    const totalCount = selectedProducts?.reduce((sum, item) => sum+item.quantity, 0) || 0;
    const totalPrice = selectedProducts?.reduce((sum, item) => sum+(item.product.price*item.quantity), 0) || 0;
    const orderData =  {
        items: selectedProducts?.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        })) || []
    };

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

            <div className="cart-list">
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
                            <input type='checkbox' checked={selectedItems.includes(item.id)} onChange={() => {
                                if(selectedItems.includes(item.id)){
                                    setSelectedItems(selectedItems.filter(id=>id!==item.id));
                                } else {
                                    setSelectedItems([...selectedItems, item.id]);
                                }
                            }}></input>               
                            <button className='delete-button' onClick={() => { store.deleteCartItem(item.id) }}>
                                <img src={`${API_URL}/uploads/delete.jpg`} alt='Удалить' />                        
                            </button>
                        </div>                
                    )) 
                }
            </div>

            <div className='cart-summary'>
                <h2>Ваша корзина</h2>
                
                 <div className="summary-row">
                    <span>Товары</span>
                    <span>{totalCount}</span>
                </div>

                 <div className="summary-total">
                    <span>Итого</span>
                    <span>{totalPrice} ₽</span>
                </div>

                <button disabled={selectedItems.length === 0} onClick={async () => { 
                    try {
                        const order = await store.createOrder(orderData);
                        navigate(`/orders/${order.id}/payment`);
                    } catch(error: any) {
                        setError(error.response.data.message || "Ошибка создания заказа");
                    }
                }}
                >
                    Перейти к оформлению
                </button>
            </div>
        </div>
    )
})