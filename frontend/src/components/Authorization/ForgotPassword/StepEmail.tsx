import { useContext, useState } from "react"
import { Context } from "../../../main";

type StepEmailProps = {
    next: (email: string) => void
}

export default function StepEmail({ next }: StepEmailProps) {
    
    const [email, setEmail] = useState('');
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            await store.forgotPassword(email);
            next(email);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h2>Восстановление пароля</h2>
            <input type='email' placeholder='email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <button onClick={handleButtonClick}>Продолжить</button>
        </div>
    )
}