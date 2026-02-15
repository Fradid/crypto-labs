import React from 'react';
import { Shield, Github, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { AlphabetType, ALPHABET_LABELS } from '../ciphers/alphabets';

interface HeaderProps {
  alphabet: AlphabetType;
  setAlphabet: (a: AlphabetType) => void;
}

export const Header: React.FC<HeaderProps> = ({ alphabet, setAlphabet }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <Shield size={24} />
          </div>
          <div className="logo-text">
            <h1>Crypto Lab</h1>
            <span>Лабораторія шифрування</span>
          </div>
        </div>

        <nav className="header-nav">
          <div className="alphabet-toggle">
            {(Object.keys(ALPHABET_LABELS) as AlphabetType[]).map((alp) => (
              <button
                key={alp}
                onClick={() => setAlphabet(alp)}
                className={`toggle-btn ${alphabet === alp ? 'active' : ''}`}
                title={ALPHABET_LABELS[alp]}
              >
                {alphabet === alp && (
                  <motion.div
                    layoutId="active-pill"
                    className="active-pill"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="toggle-text">{alp === 'ukr' ? 'UA' : 'EN'}</span>
              </button>
            ))}
          </div>

          <div className="divider" />

          <a href="#" className="nav-link">
            <BookOpen size={16} />
            <span>Довідка</span>
          </a>
          <a href="#" className="nav-link">
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </nav>
      </div>

      <style>{`
        .header {
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(10, 10, 11, 0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: var(--shadow-glow);
        }

        .logo-text h1 {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .logo-text span {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 400;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .alphabet-toggle {
          display: flex;
          background: var(--bg-secondary);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          margin-right: 0.5rem;
        }

        .toggle-btn {
          position: relative;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: color 0.2s ease;
          isolation: isolate;
        }

        .toggle-btn.active {
          color: var(--accent-primary);
        }

        .active-pill {
          position: absolute;
          inset: 0;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          z-index: -1;
        }

        .toggle-text {
          position: relative;
          z-index: 1;
        }

        .toggle-btn:hover:not(.active) {
          color: var(--text-secondary);
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--border-subtle);
          margin: 0 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        @media (max-width: 600px) {
          .header-content {
            padding: 1rem;
          }

          .nav-link span {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
