import { Suspense, startTransition, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { SidebarLink } from "../components/Sidebar/Nav/Nav";
import { useAuthStore } from "../store/authStore";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import Loader from "../components/Loader";
import './Layout.scss';

const Layout = () => {
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);
    const navigate = useNavigate();

    useSessionTimeout();

    useEffect(() => {
        const checkToken = () => {
            const { user, isTokenExpired } = useAuthStore.getState();
            if (user && isTokenExpired()) {
                clearUser();
                navigate('/');
            }
        };

        checkToken();

        const interval = setInterval(checkToken, 60_000);
        return () => clearInterval(interval);
    }, [clearUser, navigate]);

    const isAdmin = user?.roles?.includes('admin');
    const navLinks: SidebarLink[] = [
        { icon: 'fas fa-home', label: 'Inicio', onClick: () => startTransition(() => navigate('/dashboard')) },
        { icon: 'fas fa-file-contract', label: 'Usuarios', onClick: () => startTransition(() => navigate('/usuarios')) },
    ];
    if (isAdmin) {
        navLinks.push({ icon: 'fas fa-shield-alt', label: 'Administrar', onClick: () => startTransition(() => navigate('/administrar')) });
    }

    return (
        <div className="layout">
            <Sidebar>
                <Sidebar.Header />
                <Sidebar.Nav links={navLinks} />
                <Sidebar.Footer />
            </Sidebar>
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </div>
    )
}

export default Layout;
