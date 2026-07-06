import { useContext, useState } from "react"
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const {store} = useContext(Context);
    const navigate = useNavigate();
    return (
        <div>
            <input type='text' placeholder='электронная почта' value={email} onChange={(event) => setEmail(event.target.value) }></input>
            <input type='password' placeholder='пароль' value={password} onChange={(event) => setPassword(event.target.value) }></input>
            <input type='text' placeholder='ваше имя' value={name} onChange={(event) => setName(event.target.value) }></input>
            <input type='text' placeholder='ваш номер телефона' value={phone} onChange={(event) => setPhone(event.target.value) }></input>
            <button onClick={() => store.register(email, password, name, phone)}>Зарегистрироваться</button>
            <button onClick={() => navigate('/login')}>У меня уже есть аккаунт</button>
        </div>
    )
}