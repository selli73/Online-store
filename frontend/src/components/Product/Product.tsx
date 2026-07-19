import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Context } from "../../main";
import { API_URL } from "../../http";
import ErrorMessage from "../Error/ErrorMessage";
import './Product.css';

export default function Product() {
    
    const { id } = useParams();
    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                if (id) {
                    await store.getProduct(id);
                }
            } catch(error: any) {
                setError(error.response.data.message || 'Не удалось загрузить товар')
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return ( <h2>Загрузка товара...</h2> )
    }

    return (        
        <div className='product-page'>

            {
                error && (
                    <ErrorMessage errorMessage={error}/>
                )
            }   

            <img className='product-page-image' src={`${API_URL}${store.product.imageUrl}`} alt={store.product.name}></img>
            <div className='product-page-info'>
                <h1 className='product-page-title'>{store.product.name}</h1>
                <h2 className='product-page-price'>{store.product.price} руб.</h2>
                <p><strong>Производитель:</strong> {store.product.manufacturer}</p>
                <p><strong>Тип детали:</strong> {store.product.partType}</p>
                { store.product.applicabilityToCars && <p><strong>Подходит для:</strong> {store.product.applicabilityToCars}</p> }
                <p className='product-page-rating'>
                    <span className='product-page-star'>★</span>
                    <span className="product-page-rating-value">{store.product.rating}</span>
                </p>
                <p className='product-page-description'>{store.product.description}</p>
            </div>
        </div>    
    )
}