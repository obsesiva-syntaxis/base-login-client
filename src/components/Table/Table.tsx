import type { ReactNode } from 'react';
import { TableProvider, type Column, type Action } from './TableContext';
import TableHead from './Head';
import TableBody from './Body';
import TableRow from './Row';
import TableCell from './Cell';
import TablePagination from './Pagination';
import './Table.scss';

interface TableRootProps {
  children: ReactNode;
  data: Record<string, unknown>[];
  columns: Column[];
  pageSize?: number;
  actions?: Action[];
  controlled?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const TableRoot = ({ children, data, columns, pageSize = 10, actions, controlled, currentPage, totalPages, onPageChange }: TableRootProps) => {
  return (
    <TableProvider data={data} columns={columns} pageSize={pageSize} actions={actions} controlled={controlled} currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}>
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
