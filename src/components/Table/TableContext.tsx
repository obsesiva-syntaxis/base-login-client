import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from 'react';

export interface Column<T = Record<string, unknown>> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface Action<T = Record<string, unknown>> {
  icon: string;
  label: string;
  variant?: 'default' | 'danger';
  onClick: (row: T) => void;
}

interface TableState<T> {
  page: number;
  totalPages: number;
  totalItems?: number;
  sortKey: string | null;
  sortDir: 'asc' | 'desc';
  paginatedData: T[];
}

interface TableActions {
  setSort: (key: string) => void;
  setPage: (page: number) => void;
}

interface TableMeta<T> {
  columns: Column<T>[];
  actions?: Action<T>[];
}

export interface TableContextValue<T = Record<string, unknown>> {
  state: TableState<T>;
  actions: TableActions;
  meta: TableMeta<T>;
}

const TableContext = createContext<TableContextValue<any> | null>(null);

export const useTable = <T = Record<string, unknown>>(): TableContextValue<T> => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within <Table>');
  return ctx as TableContextValue<T>;
};

interface TableProviderProps<T> {
  children: ReactNode;
  data: T[];
  columns: Column<T>[];
  pageSize: number;
  actions?: Action<T>[];
  controlled?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export const TableProvider = <T,>({ children, data, columns, pageSize, actions, controlled = false, currentPage = 1, totalPages: externalTotalPages, totalItems, onPageChange }: TableProviderProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [internalPage, setInternalPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = controlled
    ? (externalTotalPages ?? 1)
    : Math.max(1, Math.ceil(data.length / pageSize));

  const page = controlled
    ? Math.min(currentPage, totalPages)
    : Math.min(internalPage, totalPages);

  const paginatedData = useMemo(() => {
    if (controlled) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [controlled, sortedData, page, pageSize]);

  const setSort = useCallback((key: string) => {
    if (!controlled) setInternalPage(1);
    setSortKey(prev => {
      if (prev === key) {
        setSortDir(dir => (dir === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, [controlled]);

  const handleSetPage = useCallback((p: number) => {
    if (controlled) {
      onPageChange?.(Math.max(1, p));
    } else {
      setInternalPage(Math.max(1, Math.min(p, totalPages)));
    }
  }, [controlled, onPageChange, totalPages]);

  const value = useMemo<TableContextValue<T>>(() => ({
    state: {
      page,
      totalPages,
      totalItems,
      sortKey,
      sortDir,
      paginatedData,
    },
    actions: {
      setSort,
      setPage: handleSetPage,
    },
    meta: { columns, actions },
  }), [page, totalPages, totalItems, sortKey, sortDir, paginatedData, columns, actions, setSort, handleSetPage]);

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};
