import { useSidebar } from '../SidebarContext';
import './Nav.scss';

export interface SidebarLink {
    icon: string;
    label: string;
    onClick?: () => void;
}

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

export default Nav;