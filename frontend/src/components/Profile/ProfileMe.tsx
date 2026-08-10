import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState} from "react"
import { Context } from "../../main";
import './profile.css';
import ErrorMessage from "../Error/ErrorMessage";
import { useNavigate } from "react-router-dom";

export const ProfileMe = observer(() => {

    const [clickChange, setClickChange] = useState(false);
    const navigate = useNavigate();

    const { store } = useContext(Context);
    const [error, setError] = useState('');
    const [errorChangePassword, setErrorChangePassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (localStorage.getItem('access_token')) {
                    await store.profileMe();
                    const userOrders = await store.getMyOrders();
                    setOrders(userOrders);
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
            <div className='profile-left'>
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
            
            <div className='profile-right'>
                {
                    store.isAuth && (
                        <div className='orders-container'>
                            <h2>Мои заказы</h2>

                            {
                                orders.length === 0
                                    ? 
                                    <p>Заказов пока нет</p> 
                                    :
                                    orders.map((order) => (
                                        <div className='order-card' key={order.id} onClick={() => navigate(`/order/${order.id}/info`)}>
                                            <h3>
                                                Заказ №{order.orderNumber}
                                            </h3>

                                            <p>
                                                Сумма: {order.total} руб.
                                            </p>

                                            <p>
                                                Статус: {order.status}
                                            </p>                                           
                                        </div>
                                    ))
                            }
                        </div>
                    )
                }

                
            </div>

                

                           
        </div>
    );
});