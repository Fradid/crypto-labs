import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function gronsfeldEncrypt(text: string, keyString: string, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const ALPHABET = ALPHABETS[alphabetKey];
  const steps: CipherStep[] = [];

  // Validate key: should be numbers only
  if (!/^\d+$/.test(keyString)) {
    throw new Error('Ключ для шифру Гронсфельда має складатися лише з цифр');
  }

  const key = keyString.split('').map(Number);
  const N = ALPHABET.length;

  steps.push({
    title: 'Ключ',
    description: `Використовується числовий ключ: ${key.join('')}`,
  });

  const encrypted = text.split('').map((char, i) => {
    const idx = ALPHABET.indexOf(char.toUpperCase());
    if (idx === -1) return char;
    
    const shift = key[i % key.length];
    const newIdx = (idx + shift) % N;
    return ALPHABET[newIdx];
  }).join('');

  steps.push({
    title: 'Зашифрування',
    description: 'Кожен символ зміщується на відповідну цифру ключа (періодично).',
  });

  const decrypted = encrypted.split('').map((char, i) => {
    const idx = ALPHABET.indexOf(char.toUpperCase());
    if (idx === -1) return char;
    
    const shift = key[i % key.length];
    const newIdx = (idx - shift + N) % N;
    return ALPHABET[newIdx];
  }).join('');

  return { encrypted, decrypted, steps };
}
