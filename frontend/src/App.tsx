import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/Authorization/LoginForm";
import { RegisterForm } from "./components/Authorization/RegisterForm";
import RecoveryPasswordForm from './components/Authorization/ForgotPassword/RecoveryPasswordForm';
import {ProfileMe} from "./components/Profile/ProfileMe";
import Products from "./components/Products/Products";
import Product from "./components/Product/Product";
import Cart from "./components/Cart/Cart";

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
      </Routes>
    </BrowserRouter>
  )
}