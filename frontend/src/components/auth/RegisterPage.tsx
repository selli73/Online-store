import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { Alert } from '../ui';

export function RegisterPage() {
    const { auth } = useStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        setBusy(true);

        try {
            // name/phone на бэкенде опциональны — пустые строки не отправляем.
            await auth.register({
                email,
                password,
                name: name.trim() || undefined,
                phone: phone.trim() || undefined,
            });
            navigate('/products', { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось зарегистрироваться'));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="auth-shell">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-card__brand">
                    <span className="header__logo" aria-hidden="true">
                        ⚙
                    </span>
                    Автомагазин73
                </div>

                <h1 style={{ fontSize: '1.35rem', textAlign: 'center' }}>Регистрация</h1>

                {error && <Alert>{error}</Alert>}

                <div className="field">
                    <label className="field__label" htmlFor="reg-email">
                        Email
                    </label>
                    <input
                        id="reg-email"
                        className="input"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div className="field">
                    <label className="field__label" htmlFor="reg-password">
                        Пароль
                    </label>
                    <input
                        id="reg-password"
                        className="input"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        placeholder="Минимум 8 символов"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <span className="field__hint">Не короче 8 символов</span>
                </div>

                <div className="field">
                    <label className="field__label" htmlFor="reg-name">
                        Имя <span className="faint">— необязательно</span>
                    </label>
                    <input
                        id="reg-name"
                        className="input"
                        type="text"
                        autoComplete="name"
                        placeholder="Иван"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div className="field">
                    <label className="field__label" htmlFor="reg-phone">
                        Телефон <span className="faint">— необязательно</span>
                    </label>
                    <input
                        id="reg-phone"
                        className="input"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+7 (900) 000-00-00"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn--block btn--lg" disabled={busy}>
                    {busy ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
                </button>

                <div className="auth-card__foot">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </form>
        </div>
    );
}
