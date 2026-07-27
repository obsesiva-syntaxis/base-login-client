import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModalProvider, useModal, type ModalType, type ModalSize } from './ModalContext';
import ModalHeader from './Header';
import ModalBody from './Body';
import ModalFooter from './Footer';
import './Modal.scss';

interface ModalRootProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  size?: ModalSize;
  closeOnOverlay?: boolean;
}

const ModalContent = ({ children }: { children: ReactNode }) => {
  const { onClose, type, size, closeOnOverlay } = useModal();

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlay, onClose]);

  return (
    <div className="modal-overlay" data-testid="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal modal--${type} modal--${size}`} data-testid="modal">
        {children}
      </div>
    </div>
  );
};

const ModalRoot = ({ children, isOpen, onClose, type, size, closeOnOverlay }: ModalRootProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <ModalProvider isOpen={isOpen} onClose={onClose} type={type} size={size} closeOnOverlay={closeOnOverlay}>
      <ModalContent>
        {children}
      </ModalContent>
    </ModalProvider>,
    document.body,
  );
};

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
