import type { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from './SidebarContext';
import SidebarHeader from './Header';
import SidebarNav from './Nav';
import SidebarFooter from './Footer';
import './Sidebar.scss';

const SidebarNavInner = ({ children }: { children: ReactNode }) => {
    const { collapsed } = useSidebar();
    return (
        <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`} data-testid="sidebar">
            {children}
        </nav>
    );
};

const SidebarRoot = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <SidebarNavInner>{children}</SidebarNavInner>
        </SidebarProvider>
    );
};

const Sidebar = Object.assign(SidebarRoot, {
    Header: SidebarHeader,
    Nav: SidebarNav,
    Footer: SidebarFooter,
});
export default Sidebar;
