import { useTable } from '../TableContext';
import './Head.scss';

const TableHead = () => {
  const { state, actions, meta } = useTable();
  const cols = meta.columns.length;

  return (
    <div className="table__head" data-testid="table__head">
      <div className="table__row" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {meta.columns.map(col => (
          <div
            key={col.key}
            className={`table__cell table__cell--header${col.sortable ? ' table__cell--sortable' : ''}`}
            onClick={col.sortable ? () => actions.setSort(col.key) : undefined}
            role={col.sortable ? 'columnheader' : undefined}
            tabIndex={col.sortable ? 0 : undefined}
            onKeyDown={col.sortable ? (e) => { if (e.key === 'Enter') actions.setSort(col.key); } : undefined}
          >
            {col.header}
            {col.sortable && (
              <span className="table__sort-icon">
                {state.sortKey === col.key
                  ? (state.sortDir === 'asc' ? ' ▲' : ' ▼')
                  : ' ⇅'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHead;
