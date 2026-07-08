import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import RecoveryPasswordForm from "./components/ForgotPassword/RecoveryPasswordForm";

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='forgot-password' element={<RecoveryPasswordForm />} />
      </Routes>
    </BrowserRouter>
  )
}