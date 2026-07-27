import { useContext, useState } from "react"
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";
import './RecoveryStep.css';

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
        <div className='form'>
            <h2 className='title'>Восстановление пароля</h2>
            {
                error && <ErrorMessage errorMessage={error} />
            }
            <input  className='input' type='email' placeholder='email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className='button' onClick={handleButtonClick}>Продолжить</button>
        </div>
    )
}