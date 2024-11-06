import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AxiosAdapter } from '../../patterns/AxiosAdapter';
import './Menu.scss';
import toast from 'react-hot-toast';

const Menu = () => {

    const clearUser = useAuthStore((state) => state.clearUser);
    const user = useAuthStore((state) => state.user);
    const http = new AxiosAdapter();
    const nav = useNavigate();

    const handleLogOut = async () => {
        try {
            const token = user?.token;
            if (!token) throw new Error('No hay token de usuario');
            await http.post(
                `http://localhost:3030/api/auth/logout/${user.userId}`, 
                {}, 
                { Authorization: `Bearer ${token}` }
            );
            clearUser();
            notifyLogOut();
            nav('/');
            
        } catch (error) {
            toast.error('Error al cerrar sesión')
            console.log(error);
        }
    }

    const notifyLogOut = () => {
        toast.success('Sesión cerrada con éxito')
    }


    return (
        <div className="menu">
            <div className="menu__logout">
                <div className="menu__logout-btn" onClick={handleLogOut}>
                    <i className="fas fa-power-off" />
                </div>
            </div>
            <div className="menu__nav">
                <div className="menu__nav-bar">
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    
                </div>

            </div>
            <div className="menu__user">
                <div className="menu__user-info">
                    <div className="menu__user-info-name">Miguel Gonzalez Sierralta</div>
                    <div className="menu__user-info-email">mgonzalez@ucclog.com</div>
                </div>

                <div className="menu__user-avatar">

                </div>
            </div>
        </div>
    )
}

export default Menu;