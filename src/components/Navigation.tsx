import { CipherConfig } from '../ciphers/types';
import { Lock, Key, ArrowLeftRight, Fence, Grid, Hash, Table2, ShieldAlert, Activity, FileKey, PenTool } from 'lucide-react';
import { CipherType } from '../ciphers/types';

interface NavigationProps {
  configs: Record<CipherType, CipherConfig>;
  active: CipherType;
  onSelect: (type: CipherType) => void;
}

const icons: Record<CipherType, React.ReactNode> = {
  caesar: <Lock size={18} />,
  affine: <Key size={18} />,
  columnar: <ArrowLeftRight size={18} />,
  railfence: <Fence size={18} />,
  polybius: <Grid size={18} />,
  gronsfeld: <Hash size={18} />,
  playfair: <Table2 size={18} />,
  vernam: <ShieldAlert size={18} />,
  des: <Activity size={18} />,
  rsa: <FileKey size={18} />,
  rsa_sig: <PenTool size={18} />,
};

export const Navigation: React.FC<NavigationProps> = ({ configs, active, onSelect }) => {
  return (
    <nav className="flex flex-col gap-2">
      <div className="nav-title">Оберіть шифр</div>

      <div className="flex flex-col gap-1">
        {(Object.keys(configs) as CipherType[]).map((type) => (
          <button
            key={type}
            className={`nav-item ${active === type ? 'active' : ''}`}
            onClick={() => onSelect(type)}
          >
            <div className="nav-item-icon">{icons[type]}</div>
            <div className="nav-item-content">
              <span className="nav-item-name">{configs[type].name}</span>
              <span className="nav-item-desc">
                {type === 'caesar' && 'Зсувний'}
                {type === 'affine' && 'Математичний'}
                {type === 'columnar' && 'Перестановка'}
                {type === 'railfence' && 'Зигзаг'}
                {type === 'polybius' && 'Координати'}
                {type === 'gronsfeld' && 'Числовий'}
                {type === 'playfair' && 'Біграмний'}
                {type === 'vernam' && 'OTP'}
                {type === 'des' && 'Блочний'}
                {type === 'rsa' && 'Асиметричний'}
                {type === 'rsa_sig' && 'Підпис'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .nav-title {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
          padding: 0 0.5rem;
          margin-bottom: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--accent-subtle);
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }

        .nav-item.active .nav-item-icon {
          background: var(--accent-primary);
          color: white;
        }

        .nav-item-content {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .nav-item-name {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-item-desc {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .nav-item.active .nav-item-desc {
          color: var(--accent-secondary);
          opacity: 0.8;
        }

        @media (max-width: 900px) {
          .navigation {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .nav-title {
            display: none;
          }

          .nav-items {
            flex-direction: row;
            gap: 0.5rem;
          }

          .nav-item {
            min-width: fit-content;
          }

          .nav-item-content {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};
