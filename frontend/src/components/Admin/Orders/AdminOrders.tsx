import { useContext, useEffect, useState } from "react"
import { Context } from "../../../main"
import ErrorMessage from "../../Error/ErrorMessage";
import type IOrdersAwaitingConfirm from "../../../models/IOrderAwaitingConfirm";
import { API_URL } from "../../../http";
import './AdminOrders.css'

export default function AdminOrders() {
    
    const { store } = useContext(Context);
    const [orderAwaitConfirm, setOrderAwaitConfirm] = useState<IOrdersAwaitingConfirm>()
    const [error, setError] = useState('');
    useEffect(() => {
        async function fetchOrdersAwaitingConfirmation() {
            try {
                const orders = await store.getOrdersAwatingConfirmation();
                setOrderAwaitConfirm(orders);
            } catch(error: any) {
                setError(error.response.data.message || 'Что-то не так')
            }
        }

        fetchOrdersAwaitingConfirmation();
    }, []);

    if (error) {
        return (<ErrorMessage errorMessage={error} />)
    }

    if (orderAwaitConfirm?.orders.length === 0) {
        return (<h1>Заказов для подтверждения нет</h1>)
    }
    return (
        <div className='orders-container'>
            {
                orderAwaitConfirm && (
                    orderAwaitConfirm.orders.map(order => (
                        <div className='order-container' key={order.id}>
                            <p className='order-info'>Номер заказа: {order.orderNumber}</p>
                            <p className='order-info'>Сумма заказа: {order.total} руб.</p>                            
                            
                            <div className='products-list'>
                                { 
                                    order.items.map(item => (
                                        <div className='product-info' key={item.product.name}>
                                            <p>{item.product.name}</p>
                                            <img src={`${API_URL}${item.product.imageUrl}`}  alt={item.product.name}></img>
                                        </div>
                                    ))
                                }                            
                            </div>          

                            <div className='user-block'>
                                <h3>Покупатель</h3>
                                <p className='user-info'>Name: {order.user.name? order.user.name : 'ФИО не указан'}</p>
                                <p className='user-info'>Email: {order.user.email}</p>
                                <p className='user-info'>Phone: {order.user.phone? order.user.phone : 'номер телефона не указан' }</p>
                            </div>                   
                            

                            <button className='confirm-button' onClick={ async () => {   
                                try {
                                    await store.confirmPayment(order.id);
                                } catch(error: any) {
                                    setError(error.response.data.message || 'Что-то не так');
                                }
                                setOrderAwaitConfirm(previous => {      

                                    if (!previous) {
                                        return previous;
                                    }
                                    
                                    return {
                                        ...previous,
                                        orders: previous.orders.filter(item => item.id !== order.id)
                                    } 
                                });                                
                            }}
                                >
                                Подтвердить оплату
                            </button>
                        </div>
                    ))
                )
            }
        </div>
    )
}