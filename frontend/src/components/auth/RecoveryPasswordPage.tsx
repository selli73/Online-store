import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';
import { getErrorMessage } from '../../lib/errors';
import { Alert } from '../ui';

type Step = 'email' | 'code' | 'password' | 'done';

const STEP_ORDER: Step[] = ['email', 'code', 'password'];

/**
 * Восстановление пароля в три шага, как это устроено на бэкенде:
 * forgot-password → verify-reset-code (выдаёт reset-токен) → reset-password.
 */
export function RecoveryPasswordPage() {
    const { auth } = useStore();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function run(action: () => Promise<void>, fallback: string) {
        setError('');
        setBusy(true);

        try {
            await action();
        } catch (err) {
            setError(getErrorMessage(err, fallback));
        } finally {
            setBusy(false);
        }
    }

    function handleEmail(event: FormEvent) {
        event.preventDefault();
        void run(async () => {
            await auth.forgotPassword(email);
            setStep('code');
        }, 'Не удалось отправить код');
    }

    function handleCode(event: FormEvent) {
        event.preventDefault();
        void run(async () => {
            await auth.verifyResetCode(email, code.trim());
            setStep('password');
        }, 'Неверный или истекший код');
    }

    function handlePassword(event: FormEvent) {
        event.preventDefault();
        void run(async () => {
            await auth.resetPassword(password);
            setStep('done');
        }, 'Не удалось сменить пароль');
    }

    const currentIndex = STEP_ORDER.indexOf(step);

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-card__brand">
                    <span className="header__logo" aria-hidden="true">
                        ⚙
                    </span>
                    Восстановление пароля
                </div>

                {step !== 'done' && (
                    <div className="steps" aria-hidden="true">
                        {STEP_ORDER.map((item, index) => (
                            <span
                                key={item}
                                className={index <= currentIndex ? 'steps__dot is-done' : 'steps__dot'}
                            />
                        ))}
                    </div>
                )}

                {error && <Alert>{error}</Alert>}

                {step === 'email' && (
                    <form className="stack" onSubmit={handleEmail}>
                        <p className="muted">
                            Укажите email аккаунта — мы отправим на него шестизначный код.
                        </p>
                        <div className="field">
                            <label className="field__label" htmlFor="rec-email">
                                Email
                            </label>
                            <input
                                id="rec-email"
                                className="input"
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn--block" disabled={busy}>
                            {busy ? 'Отправляем...' : 'Отправить код'}
                        </button>
                    </form>
                )}

                {step === 'code' && (
                    <form className="stack" onSubmit={handleCode}>
                        <p className="muted">
                            Код отправлен на <strong>{email}</strong>. Он действует 15 минут.
                        </p>
                        <div className="field">
                            <label className="field__label" htmlFor="rec-code">
                                Код из письма
                            </label>
                            <input
                                id="rec-code"
                                className="input"
                                type="text"
                                required
                                autoComplete="one-time-code"
                                placeholder="Например, D23bf6"
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn--block" disabled={busy}>
                            {busy ? 'Проверяем...' : 'Подтвердить код'}
                        </button>
                        <button
                            type="button"
                            className="btn btn--ghost btn--block"
                            disabled={busy}
                            onClick={() => setStep('email')}
                        >
                            Изменить email
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form className="stack" onSubmit={handlePassword}>
                        <p className="muted">Придумайте новый пароль.</p>
                        <div className="field">
                            <label className="field__label" htmlFor="rec-password">
                                Новый пароль
                            </label>
                            <input
                                id="rec-password"
                                className="input"
                                type="password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <span className="field__hint">Не короче 8 символов</span>
                        </div>
                        <button type="submit" className="btn btn--block" disabled={busy}>
                            {busy ? 'Сохраняем...' : 'Сохранить пароль'}
                        </button>
                    </form>
                )}

                {step === 'done' && (
                    <div className="stack">
                        <Alert kind="success">Пароль изменён. Теперь войдите с новым паролем.</Alert>
                        <button
                            type="button"
                            className="btn btn--block"
                            onClick={() => navigate('/login', { replace: true })}
                        >
                            Перейти ко входу
                        </button>
                    </div>
                )}

                <div className="auth-card__foot">
                    <Link to="/login">Вернуться ко входу</Link>
                </div>
            </div>
        </div>
    );
}
