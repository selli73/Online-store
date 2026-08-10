import { useState } from "react";
import type IProduct from "../../../models/IProduct";
import ErrorMessage from "../../Error/ErrorMessage";
import type { IProductFormData } from "../../../models/IProductFormData";
import './ProductForm.css';

type ProductFormProps = {
    product: IProduct | null;
    onSave: (data: IProductFormData) => void;
    onCancel: () => void;
    saving?: boolean;
}

export function ProductForm({ product, onSave, onCancel, saving = false }: ProductFormProps) {
    
    const [error, setError] = useState<string>();

    const [name, setName] = useState<string | null>(product?.name ?? '');
    const [price, setPrice] = useState<number | null>(product?.price ?? null);
    const [stock, setStock] = useState<number | null>(product?.stock ?? null);
    const [applicabilityToCars, setApplicabilityToCars] = useState<string | null>(product?.applicabilityToCars ?? null);
    const [partType, setPartType] = useState<string | null>(product?.partType ?? null);
    const [manufacturer, setMaufacturer] = useState<string | null>(product?.manufacturer ?? null);
    const [description, setDescription] = useState<string | null>(product?.description ?? null);
    
    if (error) {
        return <ErrorMessage errorMessage={error}/>
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onSave({ name, price, stock, applicabilityToCars, partType, manufacturer, description });
    }
    

    return (
         <form className='product-form' onSubmit={handleSubmit}>

            {
                !product? <h2>Создание товара</h2> : <h2>Редактирование товара</h2>
            }

            <div className='product-form-field'>
                <label>Наименование</label>
                <input type='text' value={name || ''} onChange={(event) => { setName(event.target.value) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Цена</label>
                <input type='text' value={price || ''} onChange={(event) => { setPrice(Number(event.target.value)) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Остаток</label>
                <input type='text' value={stock || ''} onChange={(event) => { setStock(Number(event.target.value)) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Применимость к авто</label>
                <input type='text' value={applicabilityToCars || ''} onChange={(event) => { setApplicabilityToCars(event.target.value) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Тип детали</label>
                <input type='text' value={partType || ''} onChange={(event) => { setPartType(event.target.value) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Производитель</label>
                <input type='text' value={manufacturer || ''} onChange={(event) => { setMaufacturer(event.target.value) }}></input>                
            </div>

            <div className='product-form-field'>
                <label>Описание</label>
                <input type='text' value={description || ''} onChange={(event) => { setDescription(event.target.value) }}></input>                
            </div>

            <div className='product-form-actions'>
                <button type='submit' disabled={saving}>
                    { saving ? 'Сохранение...': 'Сохранить' }
                </button>

                <button type='button' onClick={onCancel} disabled={saving}>
                    Отмена
                </button>
            </div>
        </form>
    )
}