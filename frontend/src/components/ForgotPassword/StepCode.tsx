import { useContext, useState } from "react"
import { Context } from "../../main";

type StepCodeProps = {
    email: string;
    onSuccess: (token: string) => void
}

export default function StepCode({ email, onSuccess }: StepCodeProps) {
    
    const [code, setCode] = useState('');
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            const response = await store.verifyResetCode(email, code);
            const { resetToken } = response!.data;
            console.log('step code: ', resetToken);
            if (resetToken) {
                onSuccess(resetToken);
            }
        } catch(error) {
            console.log(error);
        }
    }


    return (
        <div>
            <h2>Восстановление пароля</h2>
            <input type='text' placeholder='code' value={code} onChange={(event) => setCode(event.target.value)} />
            <button onClick={handleButtonClick}>Проверить</button>
        </div>
    )
}