import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { Protected } from './Protected';
import Loader from "../components/Loader";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !user.roles.includes('admin')) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    if (user && !user.roles.includes('admin')) {
        return <Loader />;
    }

    return <Protected>{children}</Protected>;
};
