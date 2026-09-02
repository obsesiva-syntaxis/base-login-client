import { render, screen } from '@testing-library/react';
import UsuariosPage from './UsuariosPage';

describe('UsuariosPage', () => {
    it('renders heading', () => {
        render(<UsuariosPage />);
        expect(screen.getByText('USUARIOS')).toBeInTheDocument();
    });
});
