import { useContext, useState } from "react"
import { Context } from "../../../main";

type StepNewPasswordProps = {
    onChanged: () => void
}

export default function StepNewPassword({ onChanged }: StepNewPasswordProps) {
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { store } = useContext(Context);
    
    async function handleButtonClick() {
        try {
            if (newPassword !== confirmPassword) {
                console.log('Пароли не совпадают');
                return;
            }
            const response = await store.resetPassword(newPassword);
            onChanged();
            
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div>
            <input type='password' placeholder='введите пароль' value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
            <input type='password' placeholder='подтвердите пароль' value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
            <button onClick={handleButtonClick}>Сохранить</button>
        </div>
    )
}