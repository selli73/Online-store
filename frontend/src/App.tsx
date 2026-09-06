import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { setUnauthorizedHandler } from './api/client';
import { useStore } from './store/context';

import { Layout } from './components/layout/Layout';
import { RedirectIfAuth, RequireAdmin, RequireAuth } from './components/routing/guards';

import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { RecoveryPasswordPage } from './components/auth/RecoveryPasswordPage';

import { ProductsPage } from './components/catalog/ProductsPage';
import { ProductPage } from './components/catalog/ProductPage';
import { CartPage } from './components/cart/CartPage';
import { PaymentPage } from './components/orders/PaymentPage';
import { OrderPage } from './components/orders/OrderPage';
import { ProfilePage } from './components/profile/ProfilePage';

import { AdminProductsPage } from './components/admin/AdminProductsPage';
import { ProductFormPage } from './components/admin/ProductFormPage';
import { AdminOrdersPage } from './components/admin/AdminOrdersPage';

import { StateBlock } from './components/ui';

/**
 * Стартовая логика, которой нужен роутер: восстановление сессии и единая
 * реакция на 401 от любого запроса.
 */
const AppRoutes = observer(function AppRoutes() {
    const { auth, cart } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        setUnauthorizedHandler(() => {
            auth.setUser(null);
            cart.reset();
            navigate('/login', { replace: true });
        });
    }, [auth, cart, navigate]);

    useEffect(() => {
        void auth.bootstrap();
    }, [auth]);

    // Корзину тянем один раз после успешного восстановления сессии — бейдж в
    // шапке должен быть заполнен на любой странице, а не только в /cart.
    useEffect(() => {
        if (auth.isAuth) {
            void cart.load().catch(() => undefined);
        }
    }, [auth.isAuth, cart]);

    return (
        <Routes>
            <Route element={<RedirectIfAuth />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/recovery-password" element={<RecoveryPasswordPage />} />
            </Route>

            <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                    <Route index element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/orders/:orderId/payment" element={<PaymentPage />} />
                    <Route path="/order/:orderId/info" element={<OrderPage />} />
                    <Route path="/profile/me" element={<ProfilePage />} />

                    <Route element={<RequireAdmin />}>
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/products/create" element={<ProductFormPage mode="create" />} />
                        <Route path="/admin/products/edit/:id" element={<ProductFormPage mode="edit" />} />
                        <Route path="/admin/orders" element={<AdminOrdersPage />} />
                    </Route>

                    <Route
                        path="*"
                        element={
                            <StateBlock icon="🧭" title="Страница не найдена" text="Проверьте адрес." />
                        }
                    />
                </Route>
            </Route>
        </Routes>
    );
});

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
