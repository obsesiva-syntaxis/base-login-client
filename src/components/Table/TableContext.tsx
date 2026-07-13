import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';

export interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: Record<string, unknown>) => ReactNode;
}

interface TableState {
  page: number;
  totalPages: number;
  sortKey: string | null;
  sortDir: 'asc' | 'desc';
  paginatedData: Record<string, unknown>[];
}

interface TableActions {
  setSort: (key: string) => void;
  setPage: (page: number) => void;
}

interface TableMeta {
  columns: Column[];
}

export interface TableContextValue {
  state: TableState;
  actions: TableActions;
  meta: TableMeta;
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTable = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within <Table>');
  return ctx;
};

interface TableProviderProps {
  children: ReactNode;
  data: Record<string, unknown>[];
  columns: Column[];
  pageSize: number;
}

export const TableProvider = ({ children, data, columns, pageSize }: TableProviderProps) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const safePage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safePage, pageSize]);

  const setSort = useCallback((key: string) => {
    setPage(1);
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const handleSetPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const value = useMemo<TableContextValue>(() => ({
    state: {
      page: safePage,
      totalPages,
      sortKey,
      sortDir,
      paginatedData,
    },
    actions: {
      setSort,
      setPage: handleSetPage,
    },
    meta: { columns },
  }), [safePage, totalPages, sortKey, sortDir, paginatedData, columns, setSort, handleSetPage]);

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};
