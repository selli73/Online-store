import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import './auth.css';
import { Link } from "react-router-dom";


export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context)
    const navigate = useNavigate();
    

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        try {
            const response = await store.login(email, password);
            
            if (store.isAuth) {
                navigate('/profile/me');
            }

        } catch(error) {
            console.log(error);
        }
        
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Авторизация</h2>
            <div>
                <input id='email' type='email' placeholder='email' value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div>
                <input id='password' type='password' placeholder='password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
            </div>

            <button type='submit' >Вход</button>
            <button type='button' onClick={() => navigate('/register')}>Регистрация</button>
            
            <Link className="forgot-password-link" to="/recovery-password">Забыли пароль?</Link>
        </form>
    )
}