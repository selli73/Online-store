import { observer } from 'mobx-react-lite';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'header__link is-active' : 'header__link';

/** Общий каркас: шапка с навигацией + контент текущего маршрута. */
export const Layout = observer(function Layout() {
    const { auth, cart } = useStore();
    const navigate = useNavigate();

    function handleLogout() {
        auth.logout();
        cart.reset();
        navigate('/login', { replace: true });
    }

    return (
        <div className="app-shell">
            <header className="header">
                <div className="header__inner">
                    <NavLink to="/products" className="header__brand">
                        <span className="header__logo" aria-hidden="true">
                            ⚙
                        </span>
                        Автомагазин73
                    </NavLink>

                    <nav className="header__nav">
                        <NavLink to="/products" className={linkClass}>
                            Каталог
                        </NavLink>

                        {auth.isAdmin && (
                            <>
                                <NavLink to="/admin/products" className={linkClass}>
                                    Товары
                                </NavLink>
                                <NavLink to="/admin/orders" className={linkClass}>
                                    Заказы
                                </NavLink>
                            </>
                        )}

                        <NavLink
                            to="/cart"
                            className={({ isActive }) => `${linkClass({ isActive })} header__cart`}
                        >
                            🛒 Корзина
                            {cart.count > 0 && <span className="header__badge">{cart.count}</span>}
                        </NavLink>

                        <NavLink to="/profile/me" className={linkClass}>
                            👤 Профиль
                        </NavLink>

                        <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                            Выйти
                        </button>
                    </nav>
                </div>
            </header>

            <main className="page">
                <Outlet />
            </main>
        </div>
    );
});
