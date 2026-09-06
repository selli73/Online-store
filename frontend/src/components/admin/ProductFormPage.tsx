import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductsApi } from '../../api/products.api';
import { getErrorMessage } from '../../lib/errors';
import { resolveImageUrl } from '../../lib/format';
import type { IProductInput } from '../../models';
import { Alert, Loader, StateBlock } from '../ui';

type FormState = {
    name: string;
    price: string;
    stock: string;
    applicabilityToCars: string;
    partType: string;
    manufacturer: string;
    description: string;
};

const EMPTY: FormState = {
    name: '',
    price: '',
    stock: '',
    applicabilityToCars: '',
    partType: '',
    manufacturer: '',
    description: '',
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Одна страница на создание и на редактирование: формы отличаются только данными. */
export function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = mode === 'edit';

    const [form, setForm] = useState<FormState>(EMPTY);
    const [loading, setLoading] = useState(isEdit);
    const [loadError, setLoadError] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);

    useEffect(() => {
        if (!isEdit || !id) {
            return;
        }

        let cancelled = false;

        async function load(productId: string) {
            try {
                const { data } = await ProductsApi.getById(productId);
                if (cancelled) {
                    return;
                }

                setForm({
                    name: data.name,
                    price: String(data.price),
                    stock: String(data.stock),
                    applicabilityToCars: data.applicabilityToCars,
                    partType: data.partType,
                    manufacturer: data.manufacturer ?? '',
                    description: data.description ?? '',
                });
                setExistingImage(data.imageUrl);
            } catch (err) {
                if (!cancelled) {
                    setLoadError(getErrorMessage(err, 'Не удалось загрузить товар'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load(id);

        return () => {
            cancelled = true;
        };
    }, [id, isEdit]);

    // Освобождаем прошлый object URL при замене файла и при размонтировании,
    // чтобы браузер не держал выбранные картинки в памяти.
    useEffect(() => {
        if (!preview) {
            return;
        }

        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    function update(field: keyof FormState, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0] ?? null;
        setError('');

        if (!selected) {
            setFile(null);
            setPreview(null);
            return;
        }

        // Те же ограничения, что и в FileInterceptor на бэкенде.
        if (!/^image\/(png|jpe?g)$/.test(selected.type)) {
            setError('Допустимы только изображения PNG или JPEG');
            event.target.value = '';
            return;
        }

        if (selected.size > MAX_IMAGE_BYTES) {
            setError('Файл больше 5 МБ');
            event.target.value = '';
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');

        const price = Number(form.price);
        const stock = Number(form.stock);

        if (!Number.isInteger(price)) {
            setError('Цена должна быть целым числом');
            return;
        }

        if (!Number.isInteger(stock) || stock < 1) {
            setError('Остаток должен быть целым числом не меньше 1');
            return;
        }

        const payload: IProductInput = {
            name: form.name.trim(),
            price,
            stock,
            applicabilityToCars: form.applicabilityToCars.trim(),
            partType: form.partType.trim(),
            // Пустые необязательные поля не отправляем.
            manufacturer: form.manufacturer.trim() || undefined,
            description: form.description.trim() || undefined,
        };

        setSaving(true);

        try {
            let productId: string;

            if (isEdit) {
                productId = id!;
                await ProductsApi.update(productId, payload);
            } else {
                const { data } = await ProductsApi.create(payload);
                productId = data.id;
            }

            if (file) {
                await ProductsApi.uploadImage(productId, file);
            }

            navigate('/admin/products');
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось сохранить товар'));
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <Loader text="Загружаем товар..." />;
    }

    if (loadError) {
        return (
            <StateBlock
                icon="📦"
                title="Товар не найден"
                text={loadError}
                action={
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => navigate('/admin/products')}
                    >
                        К списку товаров
                    </button>
                }
            />
        );
    }

    const imageSrc = preview ?? resolveImageUrl(existingImage);

    return (
        <>
            <div className="page-head">
                <h1>{isEdit ? 'Редактирование товара' : 'Новый товар'}</h1>
            </div>

            <form className="panel stack" onSubmit={handleSubmit}>
                {error && <Alert>{error}</Alert>}

                <div className="form-grid">
                    <div className="field form-grid__full">
                        <label className="field__label" htmlFor="p-name">
                            Наименование *
                        </label>
                        <input
                            id="p-name"
                            className="input"
                            required
                            maxLength={256}
                            value={form.name}
                            onChange={(event) => update('name', event.target.value)}
                        />
                        <span className="field__hint">Должно быть уникальным</span>
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="p-price">
                            Цена, ₽ *
                        </label>
                        <input
                            id="p-price"
                            className="input"
                            type="number"
                            step={1}
                            required
                            value={form.price}
                            onChange={(event) => update('price', event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="p-stock">
                            Остаток, шт. *
                        </label>
                        <input
                            id="p-stock"
                            className="input"
                            type="number"
                            step={1}
                            min={1}
                            required
                            value={form.stock}
                            onChange={(event) => update('stock', event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="p-type">
                            Тип детали *
                        </label>
                        <input
                            id="p-type"
                            className="input"
                            required
                            maxLength={256}
                            placeholder="Тормозные колодки"
                            value={form.partType}
                            onChange={(event) => update('partType', event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="p-manufacturer">
                            Производитель
                        </label>
                        <input
                            id="p-manufacturer"
                            className="input"
                            maxLength={256}
                            placeholder="Bosch"
                            value={form.manufacturer}
                            onChange={(event) => update('manufacturer', event.target.value)}
                        />
                    </div>

                    <div className="field form-grid__full">
                        <label className="field__label" htmlFor="p-applicability">
                            Применимость к авто *
                        </label>
                        <input
                            id="p-applicability"
                            className="input"
                            required
                            maxLength={256}
                            placeholder="Lada Vesta 2015-2023"
                            value={form.applicabilityToCars}
                            onChange={(event) => update('applicabilityToCars', event.target.value)}
                        />
                    </div>

                    <div className="field form-grid__full">
                        <label className="field__label" htmlFor="p-description">
                            Описание
                        </label>
                        <textarea
                            id="p-description"
                            className="textarea"
                            maxLength={1000}
                            value={form.description}
                            onChange={(event) => update('description', event.target.value)}
                        />
                        <span className="field__hint">До 1000 символов</span>
                    </div>

                    <div className="field form-grid__full">
                        <label className="field__label" htmlFor="p-image">
                            Изображение
                        </label>

                        <div className="row row--wrap">
                            {imageSrc && (
                                <div className="thumb" style={{ width: 96, height: 96 }}>
                                    <img src={imageSrc} alt="Превью товара" />
                                </div>
                            )}

                            <input
                                id="p-image"
                                className="input"
                                type="file"
                                accept="image/png,image/jpeg"
                                style={{ maxWidth: 320 }}
                                onChange={handleFile}
                            />
                        </div>

                        <span className="field__hint">PNG или JPEG, до 5 МБ</span>
                    </div>
                </div>

                <div className="row">
                    <button type="submit" className="btn" disabled={saving}>
                        {saving ? 'Сохраняем...' : 'Сохранить'}
                    </button>
                    <button
                        type="button"
                        className="btn btn--secondary"
                        disabled={saving}
                        onClick={() => navigate('/admin/products')}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </>
    );
}
