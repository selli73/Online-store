import { useState } from "react"
import StepEmail from "./StepEmail";
import StepCode from "./StepCode";
import StepNewPassword from "./StepNewPassword";

type statusPasswordType = 'unchanged' | 'changed';

export default function RecoveryPasswordForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<statusPasswordType>('unchanged');
    

    console.log('app');
    console.log('Текущений стэп', step);
    function handleNext(email: string) {
        setEmail(email);
        setStep(2);
    }

    function onSuccess() {
        setStep(3);
    }

    function eventChangedPassword() {
        setStatus('changed');
        setStep(0);
    }

    return (
        <div>
        {
            step === 1 && (
                <StepEmail next={handleNext}/>
            )
        }
        {
            step === 2 && (
                <StepCode email={email} onSuccess={onSuccess}/>
            )
        }
        {
            step === 3 && (
                <StepNewPassword onChanged={eventChangedPassword}/>
            )
        }
        {
            status === 'changed' && (
                <h1>Пароля успешно изменен</h1>
            )
        }
        </div>
    )
}