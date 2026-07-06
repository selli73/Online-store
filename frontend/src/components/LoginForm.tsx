import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";



export const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context)
    const navigate = useNavigate();
    return (
        <div>
            <input type='text' placeholder='email' value={email} onChange={(event) => setEmail(event.target.value)}></input>
            <input type='password' placeholder='password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
            <button onClick={() => store.login(email, password) }>Вход</button>
            <button onClick={() => navigate('/register')}>Регистрация</button>
        </div>
    )
}