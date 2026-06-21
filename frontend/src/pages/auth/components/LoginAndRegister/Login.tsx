import { LoginAndRegisterField } from './LoginAndRegisterField';
import './Login.css'
import '../Button/Button.css';
import { Button } from '../Button/Button.tsx';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { loginUser, saveToken } from '../../../../api/authApi';



type LoginProps = {
    onRegisterClick: () => void;
};

export function Login({ onRegisterClick }: LoginProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError('');
        setLoading(true);

        try {
            const data = await loginUser({
                email,
                password
            });

            saveToken(data.access_token);

            console.log('Login success', data)
        }
        catch(error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ошибка авторизации');
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Authorization</h1>

                <form className="login-form" onSubmit={handleSubmit}>
                    <LoginAndRegisterField type='email' placeholder='Enter your email' value={email} onChange={(event) => setEmail(event.target.value)} required/>                   
                    <LoginAndRegisterField type='password' placeholder='Enter your password' value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8}/>

                    {error && <p className='error-text'>{error}</p>}

                    <Button disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </Button>                                                
                </form>
                
                <p className="register-text">
                    Don't have an account? 
                    <button className="link-button" type="button" onClick={onRegisterClick}>Create Account</button>
                </p>
            </div>
        </div>
    );
}