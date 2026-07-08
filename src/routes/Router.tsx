import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import { Protected } from './Protected';
import PublicRoute from './PublicRoute';
import Loader from "../components/Loader";

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ "../pages/LoginPage/LoginPage"));
const DashboardPage = lazy(() => import(/* webpackChunkName: "dashboard" */ "../pages/DashboardPage/DashboardPage"));

const Router = () => {
    return (
        <Suspense fallback={<div className="route-loading"><Loader /></div>}>
            <Routes>
                <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={
                        <Protected>
                            <DashboardPage />
                        </Protected>
                    }
                    />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default Router;
