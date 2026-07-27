import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/Authorization/LoginForm";
import { RegisterForm } from "./components/Authorization/RegisterForm";
import RecoveryPasswordForm from './components/Authorization/ForgotPassword/RecoveryPasswordForm';
import {ProfileMe} from "./components/Profile/ProfileMe";
import Products from "./components/Products/Products";
import Product from "./components/Product/Product";
import Cart from "./components/Cart/Cart";
import Payment from "./components/Payment/Payment";
import AdminOrders from "./components/Admin/Orders/AdminOrders";
import Order from "./components/Order/Order";

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/recovery-password' element={<RecoveryPasswordForm />} />
        <Route path='/profile/me' element={<ProfileMe />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders/:orderId/payment' element={<Payment />} />
        <Route path='/adminOrders' element={<AdminOrders />} />
        <Route path='/order/:orderId/info' element={<Order />} />
      </Routes>
    </BrowserRouter>
  )
}