import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";
import type { IPaymentDetails } from "../../models/IPaymentDetails";
import './Payment.css'

export default function Payment() {
    
    const { orderId } = useParams<string>();
    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        
        async function fetchPaymentDetails() {
            try {
                if (!orderId) {
                    return;
                }
                const details = await store.getPaymentDetails(orderId);

                setPaymentDetails(details);

            } catch(error: any) {
                setError(error.response.data.message || 'Ошибка на сервере');
            }
        }
        
        fetchPaymentDetails();
    }, [orderId])

    if (error) {
        return (
            <ErrorMessage errorMessage={error} />
        )
    }

    if (!paymentDetails) {
        return (
            <h2>Загрузка реквизитов...</h2>
        )
    }
    
    return (
        <div className='container-requisites'>
            <h1>Оплата заказа</h1>
            <div className='requisite-row'>
                <span>Банк</span>
                <strong>{paymentDetails.bankName}</strong>
            </div>

            <div className='requisite-row'>
                <span>Получатель</span>
                <strong>{paymentDetails.receiverName}</strong>
            </div>

            <div className='requisite-row'>
                <span>Карта</span>
                <strong>{paymentDetails.cardNumber}</strong>
            </div>

            <div className='requisite-row total'>
                <span>Сумма</span>
                <strong>{paymentDetails.amountToPay} ₽</strong>
            </div>

            <div className='instruction'>
                {paymentDetails.instruction}
            </div>

            <button className='button-confirm' onClick={async () => { 
                if (orderId) {
                    await store.notifyManualPayment(orderId)
                    navigate('/profile/me')
                }                
            }}
            >
                ✓ Я оплатил заказ
            </button>
        </div>
    )
}