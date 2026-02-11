import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function caesarEncrypt(text: string, key: number, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const ALPHABET = ALPHABETS[alphabetKey];
  const steps: CipherStep[] = [];

  // Step 1: Show alphabet
  steps.push({
    title: 'Алфавіт',
    description: `Використовується алфавіт довжиною ${ALPHABET.length} символів`,
  });

  // Encryption
  const encrypted = text.split('').map((char) => {
    const charIndex = ALPHABET.indexOf(char.toUpperCase());
    if (charIndex === -1) return char;
    // Fix negative modulo bug
    const newIndex = (charIndex + key) % ALPHABET.length;
    return ALPHABET[(newIndex + ALPHABET.length) % ALPHABET.length];
  }).join('');

  steps.push({
    title: 'Зашифрування',
    description: `Кожен символ зсувається на ${key} позицій вперед: C = (P + ${key}) mod ${ALPHABET.length}`,
  });

  // Decryption
  const decrypted = encrypted.split('').map((char) => {
    const charIndex = ALPHABET.indexOf(char);
    if (charIndex === -1) return char;
    // Fix negative modulo bug
    const newIndex = (charIndex - key) % ALPHABET.length;
    return ALPHABET[(newIndex + ALPHABET.length) % ALPHABET.length];
  }).join('');

  steps.push({
    title: 'Розшифрування',
    description: `Зворотній зсув на ${key} позицій: P = (C - ${key}) mod ${ALPHABET.length}`,
  });

  return { encrypted, decrypted, steps };
}

export function caesarBruteForce(text: string, alphabetKey: AlphabetType = 'ukr'): Array<{ key: number; result: string }> {
  const ALPHABET = ALPHABETS[alphabetKey];
  const results = [];
  for (let k = 0; k < ALPHABET.length; k++) {
    const decrypted = text.split('').map((char) => {
      const idx = ALPHABET.indexOf(char);
      if (idx === -1) return char;
      // Fix negative modulo bug
      return ALPHABET[(idx - k + ALPHABET.length) % ALPHABET.length];
    }).join('');
    results.push({ key: k, result: decrypted });
  }
  return results;
}
