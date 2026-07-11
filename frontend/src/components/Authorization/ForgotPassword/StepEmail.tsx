import { useContext, useState } from "react"
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";

type StepEmailProps = {
    next: (email: string) => void
}

export default function StepEmail({ next }: StepEmailProps) {
    
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            await store.forgotPassword(email);
            next(email);
        } catch(error: any) {
            setError(error.response.data.message || 'Что-то пошло не так');
        }
    }

    return (
        <div>
            <h2>Восстановление пароля</h2>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            <input type='email' placeholder='email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <button onClick={handleButtonClick}>Продолжить</button>
        </div>
    )
}