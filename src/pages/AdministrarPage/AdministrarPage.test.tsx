import { render, screen } from '@testing-library/react';
import AdministrarPage from './AdministrarPage';

describe('AdministrarPage', () => {
  it('renders heading and user count', () => {
    render(<AdministrarPage />);
    expect(screen.getByText('Administrar Usuarios')).toBeInTheDocument();
    expect(screen.getByText('12 usuarios')).toBeInTheDocument();
  });

  it('renders table with columns', () => {
    render(<AdministrarPage />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Rol')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Último Acceso')).toBeInTheDocument();
  });

  it('renders mock user data', () => {
    render(<AdministrarPage />);
    expect(screen.getByText('Carlos Mendoza')).toBeInTheDocument();
    expect(screen.getByText('maria@empresa.com')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    render(<AdministrarPage />);
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
  });
});
