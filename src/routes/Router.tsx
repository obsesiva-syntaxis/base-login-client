import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import Layout from "../Layout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { Protected } from './Protected';

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