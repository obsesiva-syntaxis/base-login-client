import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('renders header title', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Modal.Header title="Mi título" />
      </Modal>,
    );
    expect(screen.getByText('Mi título')).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Modal.Body><span>cuerpo del modal</span></Modal.Body>
      </Modal>,
    );
    expect(screen.getByText('cuerpo del modal')).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <Modal.Footer><button>Aceptar</button></Modal.Footer>
      </Modal>,
    );
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
  });

  it('calls onClose when clicking close button', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header title="test" />
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking overlay (default)', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on overlay click when type is form', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} type="form">
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies type class', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} type="alert">
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    const modal = screen.getByTestId('modal');
    expect(modal.classList.contains('modal--alert')).toBe(true);
  });

  it('applies size class', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} size="lg">
        <Modal.Body>contenido</Modal.Body>
      </Modal>,
    );
    const modal = screen.getByTestId('modal');
    expect(modal.classList.contains('modal--lg')).toBe(true);
  });
});
