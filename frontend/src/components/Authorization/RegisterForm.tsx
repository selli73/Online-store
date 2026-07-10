import { useContext, useState, type FormEvent } from "react"
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";

export const RegisterForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [error, setError] = useState<string>('')
    const {store} = useContext(Context);
    const navigate = useNavigate();

    console.log('a')

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        try {
            await store.register(email, password, name, phone);

            if (store.isAuth) {
                navigate('/profile/me');
            }
        } catch(error: any) {
            setError(error.response.data.message || 'Что-то пошло не так')
        }
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Регистрация</h2>
            {
                error && <ErrorMessage errorMessage={error}/>
            }
            <input type='email' placeholder='email' value={email} onChange={(event) => {
                setEmail(event.target.value);
                setError('')
                }} />
            <input type='password' placeholder='пароль' value={password} onChange={(event) => {
                setPassword(event.target.value);
                setError('');
                }} />
            <input type='text' placeholder='имя' value={name} onChange={(event) => setName(event.target.value) } />
            <input type='text' placeholder='номер телефона' value={phone} onChange={(event) => setPhone(event.target.value) } />
            <button type='submit'>Зарегистрироваться</button>
            <button type='button' onClick={() => navigate('/login')}>У меня уже есть аккаунт</button>
        </form>
    )
}