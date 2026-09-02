import type { ReactNode } from 'react';
import './Cell.scss';

interface TableCellProps {
  children: ReactNode;
  header?: boolean;
}

const TableCell = ({ children, header }: TableCellProps) => {
  return (
    <div
      className={`table__cell${header ? ' table__cell--header' : ''}`}
      data-testid="table__cell"
    >
      {children}
    </div>
  );
};

export default TableCell;
