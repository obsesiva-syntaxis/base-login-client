import { render, screen } from '@testing-library/react';
import AdministrarPage from './AdministrarPage';

describe('AdministrarPage', () => {
    it('renders heading', () => {
        render(<AdministrarPage />);
        expect(screen.getByText('ADMINISTRAR')).toBeInTheDocument();
    });
});
