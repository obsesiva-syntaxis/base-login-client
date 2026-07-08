import { createContext, useContext, useState, type ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import './Sidebar.scss';

interface SidebarLink {
    icon: string;
    label: string;
    onClick?: () => void;
}

interface SidebarContextValue {
    collapsed: boolean;
    toggleCollapsed: () => void;
    hoveredIndex: number | null;
    setHoveredIndex: (v: number | null) => void;
    footerOpen: boolean;
    toggleFooter: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within <Sidebar>');
    return ctx;
};

const SidebarRoot = ({ children }: { children: ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [footerOpen, setFooterOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const toggleCollapsed = () => setCollapsed((c) => !c);
    const toggleFooter = () => setFooterOpen((f) => !f);

    return (
        <SidebarContext.Provider value={{ collapsed, toggleCollapsed, hoveredIndex, setHoveredIndex, footerOpen, toggleFooter }}>
            <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} data-testid="sidebar">
                {children}
            </nav>
        </SidebarContext.Provider>
    );
};

const Header = () => {
    const { collapsed, toggleCollapsed } = useSidebar();
    return (
        <>
            <div className="sidebar__header">
                <span className="sidebar__title">MiApp</span>
                <button
                    className="sidebar__toggle"
                    onClick={toggleCollapsed}
                    aria-label="Alternar sidebar"
                    aria-expanded={!collapsed}
                >
                    <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'} sidebar__burger`} />
                </button>
            </div>
            <hr className="sidebar__divider" />
        </>
    );
};

interface NavProps {
    links: SidebarLink[];
}

const Nav = ({ links }: NavProps) => {
    const { hoveredIndex, setHoveredIndex } = useSidebar();

    return (
        <div className="sidebar__content">
            {links.map((link, index) => (
                <button
                    key={link.label}
                    className="sidebar__nav-button"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={link.onClick}
                >
                    <i className={link.icon} />
                    <span>{link.label}</span>
                </button>
            ))}
            <div
                className="sidebar__content-highlight"
                style={{
                    top: hoveredIndex !== null ? `${hoveredIndex * 5.4 + 1}rem` : '-7rem',
                }}
            />
        </div>
    );
};

const Footer = () => {
    const { footerOpen, toggleFooter } = useSidebar();
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const nav = useNavigate();

    const handleLogout = () => {
        clearUser();
        nav('/');
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
                <button className="sidebar__logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </div>
    );
};

const Sidebar = Object.assign(SidebarRoot, { Header, Nav, Footer });
export default Sidebar;
