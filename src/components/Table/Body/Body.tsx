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

  return (
    <div className="table__body" data-testid="table__body">
      {state.paginatedData.map((row, rowIndex) => (
        <div className="table__row" key={rowIndex} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {meta.columns.map(col => (
            <div className="table__cell" key={col.key} data-label={col.header}>
              {col.render ? col.render(row) : String(row[col.key] ?? '')}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableBody;
