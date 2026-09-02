import type { ReactNode } from 'react';
import './Row.scss';

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

const TableRow = ({ children, onClick }: TableRowProps) => {
  return (
    <div
      className={`table__row${onClick ? ' table__row--clickable' : ''}`}
      data-testid="table__row"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {children}
    </div>
  );
};

export default TableRow;
