import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import './Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <Sidebar
                links={[
                    { icon: 'fas fa-home', label: 'Inicio', onClick: () => console.log('inicio') },
                    { icon: 'fas fa-user', label: 'Perfil', onClick: () => console.log('inicio') },
                    { icon: 'fas fa-cog', label: 'Configuración', onClick: () => console.log('inicio') },
                ]}
            />
            <Outlet />
        </div>
    )
}

export default Layout;