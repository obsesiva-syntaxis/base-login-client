import type { ReactNode } from 'react';
import { useModal } from '../ModalContext';
import './Header.scss';

interface ModalHeaderProps {
  title?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
}

const ModalHeader = ({ title, children, showCloseButton = true }: ModalHeaderProps) => {
  const { onClose } = useModal();

  return (
    <div className="modal__header" data-testid="modal__header">
      <div className="modal__header-content">
        {title && <h2 className="modal__title">{title}</h2>}
        {children}
      </div>
      {showCloseButton && (
        <button className="modal__close" onClick={onClose} aria-label="Cerrar" type="button">
          ✕
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
