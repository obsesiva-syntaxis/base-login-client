import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import { Protected } from './Protected';
import { AdminRoute } from './AdminRoute';
import PublicRoute from './PublicRoute';

const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ "../pages/LoginPage/LoginPage"));
const DashboardPage = lazy(() => import(/* webpackChunkName: "dashboard" */ "../pages/DashboardPage/DashboardPage"));
const UsuariosPage = lazy(() => import(/* webpackChunkName: "usuarios" */ "../pages/UsuariosPage/UsuariosPage"));
const AdministrarPage = lazy(() => import(/* webpackChunkName: "administrar" */ "../pages/AdministrarPage/AdministrarPage"));

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={
                    <Protected>
                        <DashboardPage />
                    </Protected>
                }
                />
                <Route path="/usuarios" element={
                    <Protected>
                        <UsuariosPage />
                    </Protected>
                }
                />
                <Route path="/administrar" element={
                    <AdminRoute>
                        <AdministrarPage />
                    </AdminRoute>
                }
                />
            </Route>
        </Routes>
    )
}

export default Router;
