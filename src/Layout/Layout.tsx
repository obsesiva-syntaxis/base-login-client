import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuthStore } from "../store/authStore";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import './Layout.scss';

const navLinks = [
    { icon: 'fas fa-home', label: 'Inicio' },
    { icon: 'fas fa-user', label: 'Perfil' },
    { icon: 'fas fa-cog', label: 'Configuración' },
];

const Layout = () => {
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

    return (
        <div className="layout">
            <Sidebar>
                <Sidebar.Header />
                <Sidebar.Nav links={navLinks} />
                <Sidebar.Footer />
            </Sidebar>
            <Outlet />
        </div>
    )
}

export default Layout;
