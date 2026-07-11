type ErrorMessageProps = {
    errorMessage: string
};

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
    return (
        <div className='error'>{errorMessage || 'Что-то пошло не так'}</div>
    )
}