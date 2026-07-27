import { useContext, useEffect, useState } from "react"
import { Context } from "../../main"
import { useParams } from "react-router-dom";
import ErrorMessage from "../Error/ErrorMessage";
import type { IOrderById } from "../../models/IOrder";
import { API_URL } from "../../http";
import './Order.css'

export default function Order() {
    
    const { store } = useContext(Context);
    const { orderId } = useParams();

    const [error, setError] = useState<string>('');
    const [errorReview, setErrorReview] = useState<{
        errorMessage: string,
        productId: string
    }>({ errorMessage: '', productId: '' });

    const [order, setOrder] = useState<IOrderById>();
    
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [review, setReview] = useState<{
        rating: number,
        productId: string,        
        comment: string
    }>({ rating: 5, productId: '', comment: '' });

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        async function fetchMyOrder() {
            try {
                const order = await store.getOrderById(orderId!);
                setOrder(order);
            } catch(error: any) {
                setError(error.response.data.message || 'Что-то не так')
            }
            
        }
        
        fetchMyOrder();
    }, [orderId, store]);

    if (error) {
        return <ErrorMessage errorMessage={error} />
    }
    
    if (!order) {
        return <p>Загрузка...</p>
    }

    return (
        <div className='order-page'>
            <div className="order-info">
                <h2>Заказ №{order.orderNumber}</h2>

                <div className="order-row">
                    <span>Статус</span>
                    <strong>{order.status}</strong>
                </div>

                <div className="order-row">
                    <span>Итого</span>
                    <strong>{order.total} ₽</strong>
                </div>
            </div>

            <h2 className="order-products-title">Товары</h2>

            <div className="order-products-grid">
                {order.items.map(item => (
                    <div
                        className="order-product-card"
                        key={item.product.id}
                    >
                        <img
                            className="order-product-image"
                            src={`${API_URL}${item.product.imageUrl}`}
                            alt={item.product.name}
                        />

                        <p className="order-product-name">
                            {item.product.name}
                        </p>

                        <p className="order-product-text">
                            Цена: {item.price} ₽
                        </p>

                        <p className="order-product-text">
                            Количество: {item.quantity}
                        </p>

                        <p className="order-product-text">
                            Рейтинг: ⭐ {item.product.rating}
                        </p>

                        {
                            successMessage && (
                                <p className='successMessage'>
                                    {successMessage}
                                </p>
                            )
                        }                        


                                                

                        {
                            errorReview.productId === item.product.id ? (
                                <ErrorMessage errorMessage={errorReview.errorMessage}/>
                            ) : (
                                <button className='rateProduct' onClick={() => { 
                                    setSelectedProductId(item.product.id);
                                    setReview({
                                        rating: 5,
                                        productId: item.product.id,
                                        comment: ''
                                    });
                                }}>
                                    Оценить товар
                                </button>
                            )
                        }

                        {
                            review.productId === item.product.id && selectedProductId && (
                                <div className='review-form'>
                                    <h4>Оставить отзыв</h4>
                                    <div className='stars'>
                                        {
                                            [1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className={ star <= review.rating? 'star active': 'star' } onClick={() => setReview(prev => ({
                                                    ...prev,
                                                    rating: star
                                                }))} >  
                                                    ★
                                                </span>
                                            ))
                                        }
                                    </div>

                                    <textarea value={review.comment} onChange={(event) => setReview(prev => ({
                                        ...prev,
                                        comment: event.target.value
                                    }))} placeholder="Напишите отзыв..."/>

                                    <div className='review-buttons'>
                                        <button onClick={async () => {
                                                try {
                                                    await store.createReview(review.rating, item.product.id, review.comment);
                                                    setSuccessMessage('Отзыв успешно отправлен!');
                                                    setReview({
                                                        rating: 5,
                                                        productId: '',
                                                        comment: ''
                                                    });
                                                    setSelectedProductId(null);
                                                } catch(error: any) {
                                                    setErrorReview({
                                                        errorMessage: error.response.data.message || 'Ошибка при отправке отзыва',
                                                        productId: item.product.id
                                                    });
                                                }                                                
                                            }}>
                                            Отправить
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedProductId(null);
                                                setErrorReview({
                                                    errorMessage: '',
                                                    productId: ''
                                                })
                                            }
                                        }
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}