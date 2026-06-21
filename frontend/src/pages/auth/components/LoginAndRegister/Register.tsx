import './Login.css'
import '../Button/Button.css';
import { LoginAndRegisterField } from './LoginAndRegisterField'
import { Button } from '../Button/Button.tsx';
import { useState, type FormEvent } from 'react';
import { registerUser, saveToken } from '../../../../api/authApi.ts';

type RegisterProps = {
    onLoginClick: () => void;
};

export function Register({ onLoginClick }: RegisterProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const data = await registerUser({
                email,
                password,
                name,
                phone
            });

            saveToken(data.access_token)

            console.log('Register success', data);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ошибка регистрации');
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Create Account</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <LoginAndRegisterField type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
                    <LoginAndRegisterField type="password" placeholder="Enter your password" value={password}  onChange={(event) => setPassword(event.target.value)} required minLength={8}/>
                    <LoginAndRegisterField type="text" placeholder="your name" value={name} onChange={(event) => setName(event.target.value)}/>
                    <LoginAndRegisterField type="text" placeholder="your phone" value={phone} onChange={(event) => setPhone(event.target.value)} />     

                    {error && <p className='error-text'>{error}</p>}    

                    <Button disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </Button>
                </form>     
                <p className="register-text">
                    Already have an account? <button className="link-button" type="button" onClick={onLoginClick}>Login</button>
                </p>   
            </div>
        </div>
    )
}