import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { Alert } from '../ui';

export function LoginPage() {
    const { auth, cart } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError('');
        setBusy(true);

        try {
            await auth.login(email, password);
            // Корзину подтягиваем сразу, чтобы бейдж в шапке был актуальным.
            await cart.load().catch(() => undefined);

            const from = (location.state as { from?: string } | null)?.from;
            navigate(from ?? '/products', { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Не удалось войти'));
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

                <h1 style={{ fontSize: '1.35rem', textAlign: 'center' }}>Вход в аккаунт</h1>

                {error && <Alert>{error}</Alert>}

                <div className="field">
                    <label className="field__label" htmlFor="login-email">
                        Email
                    </label>
                    <input
                        id="login-email"
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
                    <label className="field__label" htmlFor="login-password">
                        Пароль
                    </label>
                    <input
                        id="login-password"
                        className="input"
                        type="password"
                        autoComplete="current-password"
                        required
                        minLength={8}
                        placeholder="Минимум 8 символов"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn--block btn--lg" disabled={busy}>
                    {busy ? 'Входим...' : 'Войти'}
                </button>

                <div className="auth-card__foot">
                    <Link to="/recovery-password">Забыли пароль?</Link>
                </div>

                <div className="auth-card__foot">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
            </form>
        </div>
    );
}
