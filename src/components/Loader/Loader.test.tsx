import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders loader container', () => {
    render(<Loader />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders 4 animated divs inside ellipsis', () => {
    const { container } = render(<Loader />);
    const ellipsis = container.querySelector('[data-testid="loader"] .loader__ellipsis');
    expect(ellipsis?.children).toHaveLength(4);
  });

  it('matches snapshot', () => {
    const { container } = render(<Loader />);
    expect(container).toMatchSnapshot();
  });
});
