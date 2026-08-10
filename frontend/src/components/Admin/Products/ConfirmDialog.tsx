import './ConfirmDialog.css';

type ConfirmDialogProps = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
    title,
    message,
    confirmText = 'Удалить',
    cancelText = 'Отмена',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div className='confirm-dialog-overlay' onClick={onCancel}>
            <div className='confirm-dialog' onClick={(event) => event.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className='confirm-dialog-actions'>
                    <button type='button' className='confirm-dialog-cancel' onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button type='button' className='confirm-dialog-confirm' onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}