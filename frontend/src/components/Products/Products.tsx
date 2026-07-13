import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import ErrorMessage from "../Error/ErrorMessage";

export default function Products() {
    
    const { store } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchProducts() {
            try {
                await store.getAllProducts(1, 1);
            } catch(error: any) {
                setError(error.response.data.message || 'Не удалось загрузить товары');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);
    
    return (
        <div className='products-container'>

            <h1>Товары</h1>

            {
                error && (
                    <ErrorMessage errorMessage={error}/>
                )
            }

            <div className='products-grid'>

                {
                    store.products.map(product => (
                        <div className='product-card'>
                            <h2>{product.name}</h2>
                            <p>{product.price}</p>
                        </div>
                    ))
                }

            </div>

        </div>
    );
}