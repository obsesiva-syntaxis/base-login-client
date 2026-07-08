import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { useAuthStore } from './store/authStore';

describe('App', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('renders without crashing', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText('Iniciar Sesión')).toBeInTheDocument();
  });
});
