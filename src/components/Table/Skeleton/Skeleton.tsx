import { useMemo } from 'react';
import './Skeleton.scss';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  hasActions?: boolean;
}

const WIDTHS = ['55%', '70%', '40%', '60%', '80%', '50%', '65%', '45%'];

const TableSkeleton = ({ columns, rows = 8, hasActions = false }: TableSkeletonProps) => {
  const gridTemplateColumns = hasActions
    ? `repeat(${columns}, 1fr) auto`
    : `repeat(${columns}, 1fr)`;

  const widths = useMemo(
    () => Array.from({ length: rows }, () =>
      Array.from({ length: columns }, (_, i) => WIDTHS[(i * 3) % WIDTHS.length])
    ),
    [rows, columns]
  );

  return (
    <div className="table" data-testid="table__skeleton">
      <div className="table__head">
        <div className="table__row" style={{ gridTemplateColumns }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="table__cell table__cell--header">
              <span className="table__skeleton-bar table__skeleton-bar--head" />
            </div>
          ))}
          {hasActions && (
            <div className="table__cell table__cell--header">
              <span className="table__skeleton-bar table__skeleton-bar--head" />
            </div>
          )}
        </div>
      </div>

      <div className="table__body">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="table__row" style={{ gridTemplateColumns }}>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div key={colIdx} className="table__cell">
                <span className="table__skeleton-bar" style={{ width: widths[rowIdx][colIdx] }} />
              </div>
            ))}
            {hasActions && (
              <div className="table__cell table__cell--actions">
                <span className="table__skeleton-bar table__skeleton-bar--action" />
                <span className="table__skeleton-bar table__skeleton-bar--action" />
                <span className="table__skeleton-bar table__skeleton-bar--action" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="table__pagination">
        <span className="table__skeleton-bar table__skeleton-bar--info" />
        <div className="table__pagination-controls">
          <span className="table__skeleton-bar table__skeleton-bar--btn" />
          <span className="table__skeleton-bar table__skeleton-bar--btn" />
          <span className="table__skeleton-bar table__skeleton-bar--btn" />
          <span className="table__skeleton-bar table__skeleton-bar--btn" />
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;

