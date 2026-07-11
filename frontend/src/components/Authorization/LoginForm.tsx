import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import './auth.css';
import { Link } from "react-router-dom";
import ErrorMessage from "../Error/ErrorMessage";
import '../Error/error.css';

export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const {store} = useContext(Context)
    const navigate = useNavigate();
    

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            await store.login(email, password);
            
            if (store.isAuth) {
                navigate('/profile/me');
            }
        } catch(error: any) {
            setError(error.response.data.message || 'Что-то пошло не так');
        }
        
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Авторизация</h2>
            {
                error && <ErrorMessage errorMessage={error}/>
            }
            <div>
                <input id='email' type='email' placeholder='email' value={email} onChange={(event) => {
                    setEmail(event.target.value) 
                    setError('')
                }}/>
            </div>
            <div>
                <input id='password' type='password' placeholder='password' value={password} onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                }}></input>
            </div>

            <button type='submit' >Вход</button>
            <button type='button' onClick={() => navigate('/register')}>Регистрация</button>
            
            <Link className="forgot-password-link" to="/recovery-password">Забыли пароль?</Link>
        </form>
    )
}