import { useAuthStore } from '../../store/authStore';
import './DashboardPage.scss';

export const DashboardPage = () => {

    // Implementación de Zustand para obtener el usuario logueado

    const user = useAuthStore((state) => state.user);


    return (
        <div className="dashboard">
            <h1>DASHBOARD</h1>
            <h2>{user ? `Bienvenido ${user.fullName}` : 'No hay usuario logueado'}</h2>
            <h3>{user ? `${user.email}`: 'No hay usuario logueado'}</h3>
        </div>
    )
}
