import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import './Sidebar.scss';

interface SidebarLink {
    icon: string;
    label: string;
    onClick?: () => void;
}

interface SidebarProps {
    links: SidebarLink[];
}

const Sidebar = ({ links }: SidebarProps) => {
    const user = useAuthStore((state) => state.user);
    const [collapsed, setCollapsed] = useState(false);
    const [footerOpen, setFooterOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            <div className="sidebar__header">
                <span className="sidebar__title">MiApp</span>
                <button
                    className="sidebar__toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label="Alternar sidebar"
                >
                    <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'} sidebar__burger`} />
                </button>
            </div>

            <hr className="sidebar__divider" />

            <div className="sidebar__content">
                {links.map((link, index) => (
                    <div
                        key={link.label}
                        className="sidebar__nav-button"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={link.onClick}
                    >
                        <i className={link.icon} />
                        <span>{link.label}</span>
                    </div>
                ))}
                <div
                    className="sidebar__content-highlight"
                    style={{
                        top: hoveredIndex !== null ? `${hoveredIndex * 5.4 + 1}rem` : '-7rem',
                    }}
                />
            </div>

            <div className={`sidebar__footer ${footerOpen ? 'sidebar__footer--open' : ''}`}>
                <div className="sidebar__footer-heading">
                    <div className="sidebar__footer-avatar">
                        
                            <span>{user ? `${user.fullName.charAt(0).toUpperCase()}` : ''}</span>
                        
                    </div>
                    <div className="sidebar__footer-titlebox">
                        <span className="sidebar__footer-title">{user ? `${user.fullName}` : ''}</span>
                        <span className="sidebar__footer-subtitle">{user ? `${user.email}` : ''}</span>
                    </div>
                    <button
                        className="sidebar__footer-caret"
                        onClick={() => setFooterOpen(!footerOpen)}
                        aria-label="Mostrar opciones de cuenta"
                    >
                        <i className="fas fa-caret-up" />
                    </button>
                </div>
                <div className="sidebar__footer-content">
                    <button className="sidebar__logout-btn" onClick={() => console.log('cerrar sesión') }>
                        <i className="fas fa-sign-out-alt" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;