import type { ReactNode } from 'react';
import { TableProvider, type Column, type Action } from './TableContext';
import TableHead from './Head';
import TableBody from './Body';
import TableRow from './Row';
import TableCell from './Cell';
import TablePagination from './Pagination';
import './Table.scss';

interface TableRootProps<T> {
  children: ReactNode;
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  actions?: Action<T>[];
  controlled?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

const TableRoot = <T,>({ children, data, columns, pageSize = 10, actions, controlled, currentPage, totalPages, totalItems, onPageChange }: TableRootProps<T>) => {
  return (
    <TableProvider data={data} columns={columns} pageSize={pageSize} actions={actions} controlled={controlled} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={onPageChange}>
      <div className="table" data-testid="table">
        {children}
      </div>
    </TableProvider>
  );
};

const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Pagination: TablePagination,
});

export default Table;
