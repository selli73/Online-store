import { useContext, useState } from "react"
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";
import './RecoveryStep.css';

type StepCodeProps = {
    email: string;
    onSuccess: () => void
}

export default function StepCode({ email, onSuccess }: StepCodeProps) {
    
    const [code, setCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            await store.verifyResetCode(email, code);
            onSuccess();
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
            <input className='input' type='text' placeholder='code' value={code} onChange={(event) => setCode(event.target.value)} />
            <button className='button' onClick={handleButtonClick}>Проверить</button>
        </div>
    )
}