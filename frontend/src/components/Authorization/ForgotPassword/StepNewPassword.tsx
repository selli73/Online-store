import { useContext, useState } from "react"
import { Context } from "../../../main";
import ErrorMessage from "../../Error/ErrorMessage";

type StepNewPasswordProps = {
    onChanged: () => void
}

export default function StepNewPassword({ onChanged }: StepNewPasswordProps) {
    
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('')
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            if (newPassword !== confirmPassword) {
                console.log('Пароли не совпадают');
                return;
            }
            await store.resetPassword(newPassword);
            onChanged();
            
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
            <input className='input' type='password' placeholder='введите пароль' value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
            <input className='input' type='password' placeholder='подтвердите пароль' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
            <button className='button' onClick={handleButtonClick}>Сохранить</button>
        </div>
    )
}