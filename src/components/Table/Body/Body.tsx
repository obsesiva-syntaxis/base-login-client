import { useTable } from '../TableContext';
import './Body.scss';

const TableBody = () => {
  const { state, meta } = useTable();

  if (state.paginatedData.length === 0) {
    return (
      <div className="table__body" data-testid="table__body">
        <div className="table__empty">No hay datos</div>
      </div>
    );
  }

  const cols = meta.columns.length;
  const hasActions = !!meta.actions?.length;

  const gridTemplateColumns = hasActions
    ? `repeat(${cols}, 1fr) auto`
    : `repeat(${cols}, 1fr)`;

  return (
    <div className="table__body" data-testid="table__body">
      {state.paginatedData.map((row, rowIndex) => (
        <div className="table__row" key={rowIndex} style={{ gridTemplateColumns }}>
          {meta.columns.map(col => (
            <div className="table__cell" key={col.key} data-label={col.header}>
              {col.render ? col.render(row) : String(row[col.key] ?? '')}
            </div>
          ))}
          {hasActions && (
            <div className="table__cell table__cell--actions" data-testid="table__cell-actions">
              {meta.actions!.map(action => (
                <button
                  key={action.label}
                  className={`table__action-btn${action.variant === 'danger' ? ' table__action-btn--danger' : ''}`}
                  onClick={e => { e.stopPropagation(); action.onClick(row); }}
                  title={action.label}
                  aria-label={action.label}
                  type="button"
                >
                  {action.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableBody;
