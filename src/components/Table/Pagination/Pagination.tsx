import { useTable } from '../TableContext';
import './Pagination.scss';

const TablePagination = () => {
  const { state, actions } = useTable();

  if (state.totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, state.page - 2);
  const end = Math.min(state.totalPages, state.page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="table__pagination" data-testid="table__pagination">
      <button
        className="table__pagination-btn"
        onClick={() => actions.setPage(state.page - 1)}
        disabled={state.page <= 1}
      >
        Anterior
      </button>

      {start > 1 && (
        <>
          <button className="table__pagination-btn" onClick={() => actions.setPage(1)}>1</button>
          {start > 2 && <span className="table__pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`table__pagination-btn${p === state.page ? ' table__pagination-btn--active' : ''}`}
          onClick={() => actions.setPage(p)}
        >
          {p}
        </button>
      ))}

      {end < state.totalPages && (
        <>
          {end < state.totalPages - 1 && <span className="table__pagination-ellipsis">...</span>}
          <button className="table__pagination-btn" onClick={() => actions.setPage(state.totalPages)}>
            {state.totalPages}
          </button>
        </>
      )}

      <button
        className="table__pagination-btn"
        onClick={() => actions.setPage(state.page + 1)}
        disabled={state.page >= state.totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default TablePagination;
