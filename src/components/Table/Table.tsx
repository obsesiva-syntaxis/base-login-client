import type { ReactNode } from 'react';
import { TableProvider, type Column } from './TableContext';
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
}

const TableRoot = ({ children, data, columns, pageSize = 10 }: TableRootProps) => {
  return (
    <TableProvider data={data} columns={columns} pageSize={pageSize}>
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
