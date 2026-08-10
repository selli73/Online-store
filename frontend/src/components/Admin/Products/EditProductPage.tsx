import { useContext, useEffect, useState } from "react";
import type { IProductEdit } from "../../../models/IProductEdit"
import { Context } from "../../../main";
import { useNavigate, useParams } from "react-router-dom";
import type IProduct from "../../../models/IProduct";
import ErrorMessage from "../../Error/ErrorMessage";
import { ProductForm } from "./ProductForm";


export function EditProductPage() {    
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const [product, setProduct] = useState<IProduct>();    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {            
            async function fetchProduct() {
                setLoading(true);

                if (!id) {
                    setError('Не указан id товара');
                    return;
                }
                await store.getProduct(id);

                setProduct(store.product);
            }

            fetchProduct()
        } catch(error: any) {
            setError(error?.response?.data?.message || 'Не удалось загрузить товар');
        } finally {
            setLoading(false);
        }
    }, [id]);


    if (error) {
        return <ErrorMessage errorMessage={error}/>
    }

    if (loading) {
        return <h2>Загрузка товара...</h2>;
    }

    if (!product) {
        return null;
    }

    async function handleSave(updatedProduct: IProductEdit) {
        try {
            if (!id) {
                setError('Не указан id товара');
                return;
            }        
            await store.editProduct(id, updatedProduct);
            await navigate('/admin/products');
        } catch (error: any) {
            setError(error.message || 'Не удалось сохранить изменения товара' )
        }        
    }


    return (
       <ProductForm  product={product} onSave={handleSave} onCancel={() => navigate('/admin/products')} saving={false}/>
    )
}