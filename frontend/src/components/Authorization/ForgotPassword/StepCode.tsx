import { useContext, useState } from "react"
import { Context } from "../../../main";
import ErrorMessage from "../../ErrorMessage";

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
            const response = await store.verifyResetCode(email, code);
            onSuccess();
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
            <input type='text' placeholder='code' value={code} onChange={(event) => setCode(event.target.value)} />
            <button onClick={handleButtonClick}>Проверить</button>
        </div>
    )
}