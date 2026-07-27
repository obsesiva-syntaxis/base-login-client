import type { ReactNode } from 'react';
import './Footer.scss';

interface ModalFooterProps {
  children: ReactNode;
}

const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="modal__footer" data-testid="modal__footer">
      {children}
    </div>
  );
};

export default ModalFooter;
