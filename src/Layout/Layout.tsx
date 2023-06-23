import { Outlet } from "react-router-dom";
import { Menu } from "../components/Menu/Menu";
import './Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <Outlet />
            <Menu />
        </div>
    )
}

export default Layout;