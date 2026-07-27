import type { ReactNode } from 'react';
import './Body.scss';

interface ModalBodyProps {
  children: ReactNode;
}

const ModalBody = ({ children }: ModalBodyProps) => {
  return (
    <div className="modal__body" data-testid="modal__body">
      {children}
    </div>
  );
};

export default ModalBody;
