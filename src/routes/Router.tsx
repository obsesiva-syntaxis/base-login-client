import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage/LoginPage"
import Layout from "../Layout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { AxiosAdapter } from "../patterns/AxiosAdapter";
import { UserLoggedEssence } from "../interfaces/auth/auth.interface";

interface VerifyUserEssence {
    token: string;
    userId: string;
}

const verifyUserPromise = async (): Promise<Boolean> => {

    const userLogged: UserLoggedEssence = JSON.parse(localStorage.getItem('userLogged') || '{}');


    const http = new AxiosAdapter();
    return await http.post<Boolean>('http://127.0.0.1:3030/api/auth/verify-user', {
        token: userLogged.token,
        userId: userLogged.userId
    });
    return true;
}

const Protected = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    // verifyUserPromise()

    // return <Navigate to="/" state={{ from: location }} replace />;
    // return children;
}

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={ 
                    // <Protected>
                        <DashboardPage />
                    // </Protected>
                }
                />
            </Route>
        </Routes>
    )
}

export default Router;