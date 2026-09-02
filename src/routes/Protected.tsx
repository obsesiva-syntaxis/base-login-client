import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import Loader from "../components/Loader";

interface ProtectedProps {
    children: ReactNode;
}

export const Protected = ({ children }: ProtectedProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true });
        } else if (isTokenExpired()) {
            clearUser();
            navigate('/', { state: { from: location }, replace: true });
        }
    }, [user, isTokenExpired, clearUser, navigate, location]);

    if (!user) {
        return <Loader />;
    }

    return <>{children}</>;
}
