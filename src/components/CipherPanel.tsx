import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CipherConfig, CipherResult, CipherType } from '../ciphers/types';
import { caesarEncrypt, caesarBruteForce } from '../ciphers/caesar';
import { affineEncrypt } from '../ciphers/affine';
import { columnarEncrypt } from '../ciphers/columnar';
import { railFenceEncrypt } from '../ciphers/railfence';
import { polybiusEncrypt } from '../ciphers/polybius';
import { gronsfeldEncrypt } from '../ciphers/gronsfeld';
import { playfairEncrypt } from '../ciphers/playfair';
import { vernamEncrypt, generateVernamKey } from '../ciphers/vernam';
import { desEncrypt } from '../ciphers/des';
import { rsaEncrypt, rsaDecrypt, generateRSAKeys } from '../ciphers/rsa';
import { MatrixViz } from './MatrixViz';
import { RailViz } from './RailViz';
import { RefreshCcw, Copy, Check, Zap, Wand2, Key } from 'lucide-react';
import { AlphabetType } from '../ciphers/alphabets';

interface CipherPanelProps {
  type: CipherType;
  config: CipherConfig;
  alphabet: AlphabetType;
}

export const CipherPanel: React.FC<CipherPanelProps> = ({ type, config, alphabet }) => {
  const [text, setText] = useState('КРИПТОГРАФІЯ2024');
  const [key, setKey] = useState(
    type === 'caesar' ? '5' : 
    type === 'affine' ? '7,12' : 
    type === 'columnar' ? 'КЛЮЧ' : 
    type === 'gronsfeld' ? '2015' : 
    type === 'railfence' ? '3' : 
    type === 'playfair' ? 'КРИПТО' :
    type === 'des' ? 'KEY12345' :
    type === 'rsa' ? '' :
    ''
  );
  const [rsaMode, setRsaMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const [result, setResult] = useState<CipherResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showBruteForce, setShowBruteForce] = useState(false);
  const [bruteResults, setBruteResults] = useState<Array<{ key: number; result: string }>>([]);

  useEffect(() => {
    setKey(
      type === 'caesar' ? '5' : 
      type === 'affine' ? '7,12' : 
      type === 'columnar' ? 'КЛЮЧ' : 
      type === 'gronsfeld' ? '2015' : 
      type === 'railfence' ? '3' : 
      type === 'playfair' ? 'КРИПТО' :
      type === 'vernam' ? '' :
      type === 'des' ? 'KEY12345' :
      type === 'rsa' ? '' :
      ''
    );
    setError('');
    setResult(null);
  }, [type]);

  useEffect(() => {
    if (type === 'rsa' && rsaMode === 'decrypt') {
      handleRSADecrypt();
    } else {
      handleEncrypt();
    }
  }, [text, key, alphabet, rsaMode]);

  const handleEncrypt = () => {
    try {
      setError('');
      setShowBruteForce(false);

      if (!text || (!key && type !== 'polybius' && type !== 'vernam')) {
        setResult(null);
        return;
      }

      let res: CipherResult;

      switch (type) {
        case 'caesar':
          const shift = parseInt(key) || 0;
          res = caesarEncrypt(text, shift, alphabet);
          break;
        case 'affine':
          const [a, b] = key.split(',').map(x => parseInt(x.trim()));
          if (isNaN(a) || isNaN(b)) throw new Error('Невірний формат ключа. Використовуйте: a,b');
          res = affineEncrypt(text, a, b, alphabet);
          break;
        case 'columnar':
          if (!key.trim()) throw new Error('Введіть ключове слово');
          res = columnarEncrypt(text, key.toUpperCase());
          break;
        case 'railfence':
          const rails = parseInt(key) || 2;
          if (rails < 2) throw new Error('Мінімум 2 рейки');
          res = railFenceEncrypt(text, rails);
          break;
        case 'polybius':
          res = polybiusEncrypt(text, alphabet);
          break;
        case 'gronsfeld':
          if (!key.trim()) throw new Error('Введіть числовий ключ');
          res = gronsfeldEncrypt(text, key, alphabet);
          break;
        case 'playfair':
           if (!key.trim()) throw new Error('Введіть ключове слово');
           res = playfairEncrypt(text, key, alphabet);
           break;
        case 'vernam':
           if (!key.trim()) throw new Error('Генеруйте або введіть ключ');
           res = vernamEncrypt(text, key, alphabet);
           break;
        case 'des':
           if (!key.trim() || key.length < 8) throw new Error('Ключ має бути 8 символів');
           res = desEncrypt(text, key);
           break;
        case 'rsa': {
           const [n, e] = key.split(',').map(s => s.trim());
           if (!n || !e) throw new Error('Введіть ключ у форматі n, e');
           res = rsaEncrypt(text, n, e);
           break;
        }
        default:
          return;
      }

      setResult(res);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const handleBruteForce = () => {
    if (type === 'caesar' && text) {
      const results = caesarBruteForce(result?.encrypted || text, alphabet);
      setBruteResults(results.slice(0, 10));
      setShowBruteForce(true);
    }
  };

  const handleRSADecrypt = () => {
    try {
      setError('');
      if (!text || !key) {
        setResult(null);
        return;
      }
      const [n, d] = key.split(',').map(s => s.trim());
      if (!n || !d) throw new Error('Введіть приватний ключ у форматі n, d');
      const dec = rsaDecrypt(text, n, d);
      
      // Check if output looks like garbage (common for wrong RSA key)
      const isGarbage = /[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(dec);
      
      setResult({
        encrypted: text,
        decrypted: dec,
        steps: [
          { 
            title: 'Розшифрування', 
            description: isGarbage 
              ? 'Увага! Отримано некоректні символи. Перевірте, чи ви використовуєте саме ПРИВАТНИЙ ключ (n, d) для дешифрування, а не публічний.'
              : 'Виконано m = c^d mod n для кожного байту.' 
          }
        ]
      });
    } catch (err: any) {
      setError(err.message || 'Помилка RSA дешифрування');
      setResult(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel-header"
      >
        <h2>{config.name}</h2>
        <p>{config.description}</p>
      </motion.div>

      <div className="input-section">
        <div className="input-group">
          <label>
            {type === 'rsa' && rsaMode === 'decrypt' ? 'Шифротекст (числа через пробіл)' : 'Відкритий текст'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(type === 'rsa' ? e.target.value : e.target.value.toUpperCase())}
            placeholder={type === 'rsa' && rsaMode === 'decrypt' ? 'Вставте числа для розшифрування...' : 'Введіть текст...'}
            className="text-input"
            rows={3}
          />
        </div>

        <div className="input-row">
          <div className="input-group key-input">
            <label>
              {type === 'rsa' 
                ? (rsaMode === 'encrypt' ? 'Публічний ключ (n, e)' : 'Приватний ключ (n, d)')
                : config.keyLabel}
            </label>
            <input
              type={config.keyType === 'number' || config.keyType === 'rails' ? 'number' : 'text'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={type === 'rsa' 
                ? (rsaMode === 'encrypt' ? 'n, e' : 'n, d')
                : config.placeholder}
              className="key-field"
            />
          </div>

          <button className="action-btn primary" onClick={handleEncrypt}>
            <RefreshCcw size={16} />
            <span>Оновити</span>
          </button>

           {type === 'vernam' && (
              <button 
                className="action-btn secondary" 
                onClick={() => setKey(generateVernamKey(text.length, alphabet))}
                title="Згенерувати випадковий ключ довжиною тексту"
              >
                <Wand2 size={16} />
                <span>Gen Key</span>
              </button>
            )}

           {type === 'rsa' && (
             <button 
               className="action-btn secondary" 
               onClick={() => {
                 const keys = generateRSAKeys();
                 setKey(`${keys.n}, ${keys.e}`);
                 alert(`Згенеровано ключі!\nПублічний (зашифрування): ${keys.n}, ${keys.e}\nПриватний (розшифрування): ${keys.n}, ${keys.d}\n\nЗбережіть приватний ключ!`);
               }}
               title="Згенерувати пару ключів RSA"
             >
               <Key size={16} />
               <span>Gen Keys</span>
             </button>
           )}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="results-section"
        >
          <div className="result-cards">
            <div className="result-card encrypted">
              <div className="result-label">
                <span>Шифротекст</span>
                <div className="flex gap-2">
                  {type === 'rsa' && (
                    <button 
                      className="icon-btn"
                      onClick={() => {
                        setText(result.encrypted);
                        setRsaMode('decrypt');
                      }}
                      title="Перенести для дешифрування"
                    >
                      <RefreshCcw size={14} />
                    </button>
                  )}
                  <button 
                    className="icon-btn"
                    onClick={() => copyToClipboard(result.encrypted)}
                    title="Копіювати"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="result-value">{result.encrypted}</div>
            </div>

            <div className="result-card decrypted">
              <div className="result-label">
                <span>Розшифрований</span>
                <Check size={14} className="success-icon" />
              </div>
              <div className="result-value">{result.decrypted}</div>
            </div>
          </div>

          {type === 'caesar' && (
            <button className="brute-force-btn" onClick={handleBruteForce}>
              <Zap size={16} />
              <span>Атака повним перебором</span>
            </button>
          )}

          {showBruteForce && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="brute-force-results"
            >
              <h4>Результати перебору (перші 10):</h4>
              <div className="brute-list">
                {bruteResults.map((item) => (
                  <div key={item.key} className={`brute-item ${item.result === text ? 'match' : ''}`}>
                    <span className="brute-key">Зсув {item.key}:</span>
                    <span className="brute-text">{item.result}</span>
                    {item.result === text && <span className="brute-match">✓ оригінал</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {type === 'rsa' && (
            <div className="rsa-mode-toggle">
              <button 
                className={`mode-btn ${rsaMode === 'encrypt' ? 'active' : ''}`}
                onClick={() => setRsaMode('encrypt')}
              >
                <Zap size={14} />
                Шифрування
              </button>
              <button 
                className={`mode-btn ${rsaMode === 'decrypt' ? 'active' : ''}`}
                onClick={() => setRsaMode('decrypt')}
              >
                <RefreshCcw size={14} />
                Дешифрування
              </button>
            </div>
          )}

          <div className="steps-section">
            <h3>Покрокова візуалізація</h3>
            <div className="steps-list">
              {result.steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="step-item"
                >
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>

                    {step.visualization?.type === 'matrix' && (
                      <MatrixViz data={step.visualization} />
                    )}
                    {step.visualization?.type === 'rail' && (
                      <RailViz data={step.visualization} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <style>{`
        .panel-header {
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .panel-header p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }

        .text-input, .key-field {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.9375rem;
          resize: vertical;
          transition: all 0.2s ease;
        }

        .text-input:focus, .key-field:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-subtle);
        }

        .text-input::placeholder, .key-field::placeholder {
          color: var(--text-tertiary);
        }

        .input-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .key-input {
          flex: 1;
        }

        .key-field {
          width: 100%;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          height: fit-content;
        }

        .action-btn.primary {
          background: var(--accent-primary);
          color: white;
        }

        .action-btn.primary:hover {
          background: var(--accent-secondary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-glow);
        }

        .action-btn.secondary {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-hover);
          color: var(--text-secondary);
        }

        .action-btn.secondary:hover {
           background: var(--bg-hover);
           color: var(--text-primary);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        .results-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .result-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .result-cards {
            grid-template-columns: 1fr;
          }
        }

        .result-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 1rem;
          transition: all 0.2s ease;
        }

        .result-card.encrypted {
          border-color: var(--accent-primary);
          background: var(--accent-subtle);
        }

        .result-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-tertiary);
        }

        .result-value {
          font-family: var(--font-mono);
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--text-primary);
          word-break: break-all;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .success-icon {
          color: var(--success);
        }

        .brute-force-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--bg-tertiary);
          border: 1px dashed var(--border-hover);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .brute-force-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
          background: var(--accent-subtle);
        }

        .brute-force-results {
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1rem;
          overflow: hidden;
        }

        .brute-force-results h4 {
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .brute-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .brute-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.875rem;
        }

        .brute-item.match {
          background: rgba(34, 197, 94, 0.1);
        }

        .brute-key {
          color: var(--accent-secondary);
          min-width: 70px;
          font-weight: 500;
        }

        .brute-text {
          color: var(--text-primary);
          flex: 1;
        }

        .brute-match {
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .steps-section {
          margin-top: 1rem;
        }

        .steps-section h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .step-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }

        .step-number {
          width: 28px;
          height: 28px;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
          min-width: 0;
        }

        .step-content h4 {
          font-size: 0.9375rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .step-content p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }
        .alphabet-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          background: var(--bg-secondary);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          width: fit-content;
        }

        .alphabet-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .alphabet-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-tertiary);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }

        .alphabet-btn.active {
          background: var(--accent-subtle);
          border-color: var(--accent-primary);
          color: var(--accent-secondary);
          font-weight: 500;
        }

        .alphabet-btn:hover:not(.active) {
          border-color: var(--text-secondary);
          color: var(--text-secondary);
        }

        .rsa-mode-toggle {
          display: flex;
          background: var(--bg-secondary);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          width: fit-content;
          margin-top: 0.5rem;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn.active {
          background: var(--bg-tertiary);
          color: var(--accent-primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .mode-btn:hover:not(.active) {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
