import { observer } from 'mobx-react-lite';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store/context';
import { Loader, StateBlock } from '../ui';

/**
 * Пускает дальше только авторизованных. Пока идёт стартовая проверка токена,
 * показываем лоадер — иначе при перезагрузке страницы пользователя выкидывало бы
 * на /login ещё до того, как сессия успела восстановиться.
 */
export const RequireAuth = observer(function RequireAuth() {
    const { auth } = useStore();
    const location = useLocation();

    if (auth.isBootstrapping) {
        return <Loader text="Проверяем сессию..." />;
    }

    if (!auth.isAuth) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
});

/** Дополнительно требует роль ADMIN. */
export const RequireAdmin = observer(function RequireAdmin() {
    const { auth } = useStore();

    if (auth.isBootstrapping) {
        return <Loader text="Проверяем сессию..." />;
    }

    if (!auth.isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (!auth.isAdmin) {
        return (
            <StateBlock
                icon="🔒"
                title="Доступ только для администратора"
                text="У вашей учётной записи нет прав на этот раздел."
            />
        );
    }

    return <Outlet />;
});

/** Для /login и /register: уже авторизованного отправляем в каталог. */
export const RedirectIfAuth = observer(function RedirectIfAuth() {
    const { auth } = useStore();

    if (auth.isBootstrapping) {
        return <Loader text="Проверяем сессию..." />;
    }

    if (auth.isAuth) {
        return <Navigate to="/products" replace />;
    }

    return <Outlet />;
});
