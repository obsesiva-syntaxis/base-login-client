import { Navigate, useLocation } from "react-router-dom"
// import jwt_decode from "jwt-decode";
import { useAuthStore } from "../store/authStore";

// interface JwtToken {
//     id: string;
//     iat: number;
//     exp: number;
// }

// interface UserLoggedEssence {
//     token: string;
//     userId: string;
//     fullName: string;
//     email: string;
//     active: boolean;
// }

export const Protected = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const isTokenExpired = useAuthStore((state) => state.isTokenExpired);
    
    if (!user || isTokenExpired()) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }    
    
    return children;

    // console.log(userLogged);
    // const userLogged: UserLoggedEssence = JSON.parse(localStorage.getItem('userLogged') || '{}') as UserLoggedEssence;
    // if(Object.keys(userLogged).length === 0) {
    //     return <Navigate to="/" state={{ from: location }} replace />;
    // }
    // const { exp }: JwtToken = jwt_decode(userLogged.token);
    // if (Date.now() >= exp * 1000) {
    //     return <Navigate to="/" state={{ from: location }} replace />;
    // }
}