import { useState } from 'react';
import { CipherType, CipherConfig } from './ciphers/types';
import { CipherPanel } from './components/CipherPanel';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AlphabetType } from './ciphers/alphabets';

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
  playfair: {
    name: 'Шифр Плейфера',
    description: 'Біграмний шифр, що шифрує пари літер за допомогою матриці.',
    keyType: 'string',
    keyLabel: 'Ключове слово',
    placeholder: 'Наприклад: КРИПТО',
    supportsAlphabet: true,
  },
  vernam: {
    name: 'Шифр Вермана',
    description: 'Шифр ідеальної секретності. Ключ має бути довжиною не менше за текст.',
    keyType: 'string',
    keyLabel: 'Випадковий ключ',
    placeholder: 'Генерується автоматично',
    supportsAlphabet: true,
  },
  des: {
    name: 'Алгоритм DES',
    description: 'Data Encryption Standard. Блочний шифр, що використовує 64-бітні блоки та 56-бітний ключ.',
    keyType: 'string',
    keyLabel: 'Ключ (8 символів)',
    placeholder: 'Наприклад: KEY12345',
  },
};

function App() {
  const [activeCipher, setActiveCipher] = useState<CipherType>('caesar');
  const [alphabet, setAlphabet] = useState<AlphabetType>('ukr');

  return (
    <div className="app">
      <Header alphabet={alphabet} setAlphabet={setAlphabet} />

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
            alphabet={alphabet}
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
