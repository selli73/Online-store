import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState, type FormEvent } from "react"
import { Context } from "../main";
import './profile.css';
import ErrorMessage from "./ErrorMessage";

export const ProfileMe = observer(() => {
    const { store } = useContext(Context);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (localStorage.getItem('access_token')) {
                    await store.profileMe();
                }
            } catch(error: any) {
                
                setError(error.response.data.message || 'Что-то пошло не так');
            }
        }

        fetchProfile();
    }, []);

    async function handleSubmit() {
        await store.logout();
    }

    return (
        <div className='profile-form'>            
                <h1>{store.isAuth ? 'Мой профиль' : 'Авторизуйтесь'} </h1>                
                {
                    store.user.email && (
                        <>
                            <p>ID: {store.user.userId}</p>
                            <p>Email: {store.user.email}</p>
                            <p>Роль: {store.user.role}</p>
                        </>
                    )
                }
                
                {
                    error && (
                        <ErrorMessage errorMessage={error}/>
                    )
                }

                {
                   store.isAuth &&  <button className='logout-button' onClick={handleSubmit}>Выйти из аккаунта</button>
                }            
        </div>
    );
});