import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState} from "react"
import { Context } from "../../main";
import './profile.css';
import ErrorMessage from "../Error/ErrorMessage";

export const ProfileMe = observer(() => {

    const [clickChange, setClickChange] = useState(false);

    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [errorChangePassword, setErrorChangePassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    async function logoutClick() {
        await store.logout();
    }

    async function changePasswordClick() {
        setClickChange(true);
    }

    async function savePassword() {
        try {
            await store.changePassword(oldPassword, newPassword);
        } catch(error: any) {            
            setErrorChangePassword(error.response.data.message || 'Что-то пошло не так');
        }
    }
    return (
        <div className='profile-container'>
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
                   store.isAuth &&
                   <div className='profile-buttons'>
                        <button className='changePassword-button' onClick={changePasswordClick}>Сменить пароль</button>
                        <button className='logout-button' onClick={logoutClick}>Выйти из аккаунта</button>
                   </div>                    
                }
            </div>
                {
                    store.isAuth && clickChange &&
                    <div className='change-password-card'>
                        <h2>Смена пароля</h2>
                        <div className='passwords-container'>
                            <input type='password' placeholder='old password' value={oldPassword} onChange={(event) => setOldPassword(event.target.value)}/>
                            <input type='password' placeholder='new password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
                            {
                                errorChangePassword && (
                                    <ErrorMessage errorMessage={errorChangePassword}/>
                                )
                            }
                            <button className='save-password-button' onClick={savePassword}>Сохранить</button>
                        </div>                                            
                    </div>
                }           
        </div>
    );
});