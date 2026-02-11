import React from 'react';
import { MatrixVisualization } from '../ciphers';

interface MatrixVizProps {
  data: MatrixVisualization;
}

export const MatrixViz: React.FC<MatrixVizProps> = ({ data }) => {
  const { headers, rows, readOrder } = data;

  // Determine column order for display
  const sortedIndices = readOrder 
    ? [...Array(headers.length).keys()].sort((a, b) => readOrder.indexOf(a) - readOrder.indexOf(b))
    : [...Array(headers.length).keys()];

  return (
    <div className="matrix-viz">
      <div className="matrix-container">
        {/* Header */}
        <div className="matrix-row header">
          {headers.map((h, i) => (
            <div 
              key={i} 
              className={`matrix-cell header-cell col-${i}`}
            >
              {h}
              {readOrder && (
                <span className="order-badge">{readOrder.indexOf(i) + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="matrix-row">
            {row.map((cell, colIdx) => (
              <div 
                key={colIdx} 
                className={`matrix-cell col-${colIdx}`}
              >
                {cell === ' ' ? '·' : cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {readOrder && (
        <div className="read-order">
          <span>Порядок читання:</span>
          <div className="order-arrows">
            {sortedIndices.map((idx, i) => (
              <React.Fragment key={idx}>
                <span className="order-step">
                  {headers[idx]}
                </span>
                {i < sortedIndices.length - 1 && (
                  <span className="arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .matrix-viz {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .matrix-container {
          display: inline-flex;
          flex-direction: column;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-tertiary);
        }

        .matrix-row {
          display: flex;
        }

        .matrix-row.header {
          background: var(--accent-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .matrix-cell {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          border-right: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          position: relative;
        }

        .matrix-cell:last-child {
          border-right: none;
        }

        .matrix-row:last-child .matrix-cell {
          border-bottom: none;
        }

        .header-cell {
          font-weight: 600;
          color: var(--accent-secondary);
          background: rgba(59, 130, 246, 0.15);
        }

        .order-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.625rem;
          background: var(--accent-primary);
          color: white;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .read-order {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .order-arrows {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .order-step {
          padding: 0.25rem 0.5rem;
          background: var(--accent-subtle);
          border: 1px solid var(--accent-primary);
          border-radius: var(--radius-sm);
          color: var(--accent-secondary);
          font-weight: 500;
        }

        .arrow {
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
};
