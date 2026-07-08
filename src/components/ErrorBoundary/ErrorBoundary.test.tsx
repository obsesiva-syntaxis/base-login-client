import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Bomb = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Kaboom!');
  return <span>safe</span>;
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
});

it('renders children when no error', () => {
  render(
    <ErrorBoundary>
      <span>child content</span>
    </ErrorBoundary>
  );
  expect(screen.getByText('child content')).toBeInTheDocument();
});

it('shows error UI when child throws', () => {
  render(
    <ErrorBoundary>
      <Bomb shouldThrow={true} />
    </ErrorBoundary>
  );
  expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  expect(screen.getByText('Kaboom!')).toBeInTheDocument();
});
