import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ICreateProduct } from "../../../models/ICreateProduct";
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";
import { ProductForm } from "./ProductForm";
import type { IProductFormData } from "../../../models/IProductFormData";

export function CreateProductPage() {
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSave(data: IProductFormData) {
        if (!data.name || !data.price || !data.stock || 
            !data.applicabilityToCars || !data.partType) {
            setError('Заполните все обязательные поля');
            return;
        }

        const newProduct: ICreateProduct = {
            name: data.name,
            price: data.price,
            stock: data.stock,
            applicabilityToCars: data.applicabilityToCars,
            partType: data.partType,
            manufacturer: data.manufacturer,
            description: data.description
        };

        try {
            setSaving(true);
            await store.createProduct(newProduct);
            navigate('/admin/products');
        } catch(error: any) {
            setError(error?.response?.data?.message || 'Не удалось создать товар');
        } finally {
            setSaving(false);
        }
    }

    if (error) {
        return <ErrorMessage errorMessage={error} />
    }

    return (
        <ProductForm product={null} onSave={handleSave} onCancel={() => navigate('/admin/products')} saving={false}/>
    )
}