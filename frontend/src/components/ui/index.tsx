import type { ReactNode } from 'react';
import { formatRating, resolveImageUrl } from '../../lib/format';

/** Крутилка + подпись для состояний загрузки. */
export function Loader({ text = 'Загрузка...' }: { text?: string }) {
    return (
        <div className="state">
            <div className="spinner" />
            <span>{text}</span>
        </div>
    );
}

/** Пустое состояние / ошибка на всю страницу. */
export function StateBlock({
    icon,
    title,
    text,
    action,
}: {
    icon?: string;
    title: string;
    text?: string;
    action?: ReactNode;
}) {
    return (
        <div className="state">
            {icon && <div className="state__icon">{icon}</div>}
            <div className="state__title">{title}</div>
            {text && <p>{text}</p>}
            {action}
        </div>
    );
}

export function Alert({
    kind = 'error',
    children,
}: {
    kind?: 'error' | 'success' | 'info';
    children: ReactNode;
}) {
    if (!children) {
        return null;
    }

    const icon = kind === 'error' ? '⚠' : kind === 'success' ? '✓' : 'ℹ';

    return (
        <div className={`alert alert--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
            <span aria-hidden="true">{icon}</span>
            <span>{children}</span>
        </div>
    );
}

/**
 * Картинка товара с заглушкой: бэкенд отдаёт `imageUrl: null`, пока файл не
 * загружен, и подставлять такой src в <img> нельзя — получим битую иконку.
 */
export function Thumb({
    src,
    alt,
    className = '',
}: {
    src: string | null | undefined;
    alt: string;
    className?: string;
}) {
    const url = resolveImageUrl(src);

    return (
        <div className={`thumb ${className}`.trim()}>
            {url ? (
                <img src={url} alt={alt} loading="lazy" />
            ) : (
                <span className="thumb__placeholder" aria-hidden="true">
                    🔧
                </span>
            )}
        </div>
    );
}

export function Rating({ value }: { value: number | null | undefined }) {
    return (
        <span className="rating">
            <span className="rating__star" aria-hidden="true">
                ★
            </span>
            <span>{formatRating(value)}</span>
        </span>
    );
}

export function StarsInput({
    value,
    onChange,
}: {
    value: number;
    onChange: (rating: number) => void;
}) {
    return (
        <div className="stars-input">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={star <= value ? 'is-on' : ''}
                    aria-label={`Оценка ${star}`}
                    onClick={() => onChange(star)}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">
            <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
            >
                ← Назад
            </button>
            <span className="pagination__label">
                Страница {page} из {totalPages}
            </span>
            <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
            >
                Вперёд →
            </button>
        </div>
    );
}

export function ConfirmDialog({
    title,
    message,
    confirmText = 'Удалить',
    cancelText = 'Отмена',
    busy = false,
    onConfirm,
    onCancel,
}: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="modal-overlay" onClick={onCancel} role="presentation">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <h3>{title}</h3>
                <p className="muted">{message}</p>
                <div className="modal__actions">
                    <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
                        {cancelText}
                    </button>
                    <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={busy}>
                        {busy ? 'Удаление...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
