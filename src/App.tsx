import { useState } from 'react';
import { CipherType, CipherConfig } from './ciphers/types';
import { CipherPanel } from './components/CipherPanel';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

const cipherConfigs: Record<CipherType, CipherConfig> = {
  caesar: {
    name: 'Шифр Цезаря',
    description: 'Класичний зсувний шифр. Кожен символ зміщується на фіксовану кількість позицій в алфавіті.',
    keyType: 'number',
    keyLabel: 'Зсув (ключ)',
    placeholder: 'Введіть число (наприклад: 5)',
  },
  affine: {
    name: 'Афінний шифр',
    description: 'Математичний шифр, що використовує лінійне перетворення. Ключ складається з двох чисел (a, b).',
    keyType: 'pair',
    keyLabel: 'Ключі a, b',
    placeholder: 'Наприклад: 7, 12',
  },
  columnar: {
    name: 'Стовпцева перестановка',
    description: 'Текст записується у матрицю по рядках, а зчитується по стовпцях у порядку, визначеному ключем.',
    keyType: 'string',
    keyLabel: 'Ключове слово',
    placeholder: 'Наприклад: КЛЮЧ',
  },
  railfence: {
    name: 'Rail Fence',
    description: 'Шифр "залізничного паркану". Текст записується зигзагом по горизонтальних рейках.',
    keyType: 'rails',
    keyLabel: 'Кількість рейок',
    placeholder: 'Наприклад: 3',
  },
  polybius: {
    name: 'Квадрат Полібія',
    description: 'Кожна літера замінюється координатами її позиції у квадраті.',
    keyType: 'string',
    keyLabel: 'Ключ (не використовується)',
    placeholder: 'Без ключа',
    supportsAlphabet: true,
  },
  gronsfeld: {
    name: 'Шифр Гронсфельда',
    description: 'Модифікація шифру Віженера з використанням числового ключа.',
    keyType: 'number',
    keyLabel: 'Числовий ключ',
    placeholder: 'Наприклад: 2015',
    supportsAlphabet: true,
  },
};

function App() {
  const [activeCipher, setActiveCipher] = useState<CipherType>('caesar');

  return (
    <div className="app">
      <Header />

      <main className="main-container">
        <Navigation 
          configs={cipherConfigs} 
          active={activeCipher} 
          onSelect={setActiveCipher} 
        />

        <div className="content-area">
          <CipherPanel 
            type={activeCipher} 
            config={cipherConfigs[activeCipher]} 
          />
        </div>
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-container {
          flex: 1;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .main-container {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
        }

        .content-area {
          min-width: 0;
        }
      `}</style>
    </div>
  );
}

export default App;
