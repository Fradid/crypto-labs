import React from 'react';
import { Shield, Github, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
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
          gap: 0.5rem;
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
