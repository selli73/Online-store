import { useState } from "react";
import { Login } from "./pages/auth/components/LoginAndRegister/Login"
import { Register } from './pages/auth/components/LoginAndRegister/Register';

export function App() {
  const [authPage, setAuthPage] = useState('login');

  if (authPage === 'login') {
    return <Login onRegisterClick={() => setAuthPage('register')}></Login>
  }

  if (authPage === 'register') {
    return <Register onLoginClick={() => setAuthPage('login')}></Register>
  }
}
