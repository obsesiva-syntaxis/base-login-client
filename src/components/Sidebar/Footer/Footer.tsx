import { startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useSidebar } from '../SidebarContext';
import './Footer.scss';

const Footer = () => {
    const { footerOpen, toggleFooter } = useSidebar();
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const nav = useNavigate();

    const handleLogout = () => {
        startTransition(() => {
            clearUser();
            nav('/');
        });
    };

    return (
        <div className={`sidebar__footer ${footerOpen ? 'sidebar__footer--open' : ''}`} data-testid="sidebar-footer">
            <div className="sidebar__footer-heading">
                <div className="sidebar__footer-avatar">
                    <span>{user ? user.fullName.charAt(0).toUpperCase() : ''}</span>
                </div>
                <div className="sidebar__footer-titlebox">
                    <span className="sidebar__footer-title">{user ? user.fullName : ''}</span>
                    <span className="sidebar__footer-subtitle">{user ? user.email : ''}</span>
                </div>
                <button
                    className="sidebar__footer-caret"
                    onClick={toggleFooter}
                    aria-label="Mostrar opciones de cuenta"
                    aria-expanded={footerOpen}
                >
                    <i className="fas fa-caret-up" />
                </button>
            </div>
            <div className="sidebar__footer-content">
                <button className="sidebar__footer-nav-btn">
                    <i className="fas fa-user" />
                    <span>Perfil</span>
                </button>
                <button className="sidebar__footer-nav-btn">
                    <i className="fas fa-cog" />
                    <span>Configuración</span>
                </button>
                <hr className="sidebar__footer-divider" />
                <button className="sidebar__logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Footer;