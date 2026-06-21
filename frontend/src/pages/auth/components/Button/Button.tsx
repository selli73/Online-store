import './Button.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
}

export function Button({ children, type = 'submit', ...props}: ButtonProps) {
    return <button className="button" type={type} {...props}>
        {children}
    </button>
}