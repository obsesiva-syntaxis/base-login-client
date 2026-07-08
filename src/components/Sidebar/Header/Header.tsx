import { useSidebar } from '../SidebarContext';
import './Header.scss';

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

export default Header;