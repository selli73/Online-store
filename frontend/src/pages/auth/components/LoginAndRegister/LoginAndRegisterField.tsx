import type { InputHTMLAttributes } from "react"

type LoginAndRegisterFieldProps = InputHTMLAttributes<HTMLInputElement>;

export function LoginAndRegisterField(props: LoginAndRegisterFieldProps) {
    return (
        <div className="form-group">
            <input className='login-field' {...props}></input>
        </div>
    )
}