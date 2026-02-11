import React from 'react';
import { RailVisualization } from '../ciphers';

interface RailVizProps {
  data: RailVisualization;
}

export const RailViz: React.FC<RailVizProps> = ({ data }) => {
  const { rails, pattern, chars } = data;

  // Create grid representation
  const grid: (string | null)[][] = Array(rails).fill(null).map(() => Array(chars.length).fill(null));

  pattern.forEach((railIdx, charIdx) => {
    grid[railIdx][charIdx] = chars[charIdx];
  });

  return (
    <div className="rail-viz">
      <div className="rail-container">
        {grid.map((row, railIdx) => (
          <div key={railIdx} className="rail-row">
            <span className="rail-label">{railIdx}</span>
            <div className="rail-cells">
              {row.map((cell, colIdx) => (
                <div 
                  key={colIdx} 
                  className={`rail-cell ${cell ? 'filled' : 'empty'}`}
                >
                  {cell || ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rail-legend">
        <span>Зигзаг-запис: текст рухається від верхньої рейки до нижньої і назад</span>
      </div>

      <style>{`
        .rail-viz {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-x: auto;
        }

        .rail-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          min-width: fit-content;
        }

        .rail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rail-label {
          width: 20px;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
          text-align: center;
        }

        .rail-cells {
          display: flex;
          gap: 0.25rem;
        }

        .rail-cell {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
        }

        .rail-cell.filled {
          background: var(--accent-subtle);
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
          font-weight: 500;
        }

        .rail-cell.empty {
          border-color: var(--border-subtle);
          color: var(--text-tertiary);
        }

        .rail-legend {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
