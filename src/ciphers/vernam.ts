import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function vernamEncrypt(text: string, key: string, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const steps: CipherStep[] = [];
  const ALPHABET = ALPHABETS[alphabetKey];
  const N = ALPHABET.length;

  // Filter valid chars
  const cleanText = text.toUpperCase().split('').filter(c => ALPHABET.includes(c)).join('');
  const cleanKey = key.toUpperCase().split('').filter(c => ALPHABET.includes(c)).join('');

  if (cleanKey.length < cleanText.length) {
    throw new Error(`Довжина ключа (${cleanKey.length}) менша за довжину тексту (${cleanText.length})`);
  }

  steps.push({
    title: 'Підготовка',
    description: `Текст: ${cleanText}\nКлюч: ${cleanKey.slice(0, cleanText.length)}`,
  });

  const encrypted = cleanText.split('').map((char, i) => {
    const pIdx = ALPHABET.indexOf(char);
    const kIdx = ALPHABET.indexOf(cleanKey[i]);
    const cIdx = (pIdx + kIdx) % N;
    return ALPHABET[cIdx];
  }).join('');

  steps.push({
    title: 'Зашифрування (Модульне додавання)',
    description: `C[i] = (P[i] + K[i]) mod ${N}`,
  });

  const decrypted = encrypted.split('').map((char, i) => {
    const cIdx = ALPHABET.indexOf(char);
    const kIdx = ALPHABET.indexOf(cleanKey[i]);
    const pIdx = (cIdx - kIdx + N) % N;
    return ALPHABET[pIdx];
  }).join('');

  return { encrypted, decrypted, steps };
}

export function generateVernamKey(length: number, alphabetKey: AlphabetType = 'ukr'): string {
  const ALPHABET = ALPHABETS[alphabetKey];
  let key = '';
  for (let i = 0; i < length; i++) {
    key += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return key;
}
