import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type ModalType = 'info' | 'form' | 'alert';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const TYPE_DEFAULTS: Record<ModalType, { size: ModalSize; closeOnOverlay: boolean }> = {
  info: { size: 'md', closeOnOverlay: true },
  form: { size: 'lg', closeOnOverlay: false },
  alert: { size: 'sm', closeOnOverlay: true },
};

export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  size: ModalSize;
  closeOnOverlay: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within <Modal>');
  return ctx;
};

interface ModalProviderProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  size?: ModalSize;
  closeOnOverlay?: boolean;
}

export const ModalProvider = ({ children, isOpen, onClose, type = 'info', size, closeOnOverlay }: ModalProviderProps) => {
  const defaults = TYPE_DEFAULTS[type];

  const value = useMemo<ModalContextValue>(() => ({
    isOpen,
    onClose,
    type,
    size: size ?? defaults.size,
    closeOnOverlay: closeOnOverlay ?? defaults.closeOnOverlay,
  }), [isOpen, onClose, type, size, closeOnOverlay, defaults]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};
