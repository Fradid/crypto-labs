import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function affineEncrypt(text: string, a: number, b: number, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const ALPHABET = ALPHABETS[alphabetKey];
  const N = ALPHABET.length;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a: number, m: number): number | null {
  const extendedGcd = (a: number, b: number): [number, number, number] => {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = extendedGcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
  };

  const [g, x] = extendedGcd(a % m, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}

  const steps: CipherStep[] = [];

  if (gcd(a, N) !== 1) {
    throw new Error(`Ключ 'a' має бути взаємно простим з ${N}`);
  }

  steps.push({
    title: 'Перевірка ключа',
    description: `НСД(${a}, ${N}) = ${gcd(a, N)} = 1 ✓ Ключ придатний`,
  });

  const encrypted = text.split('').map((char) => {
    const idx = ALPHABET.indexOf(char.toUpperCase());
    if (idx === -1) return char;
    const newIdx = (a * idx + b) % N;
    return ALPHABET[(newIdx + N) % N];
  }).join('');

  steps.push({
    title: 'Зашифрування',
    description: `Формула: C = (${a} × P + ${b}) mod ${N}`,
  });

  const aInv = modInverse(a, N);
  const decrypted = encrypted.split('').map((char) => {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) return char;
    const newIdx = (aInv! * (idx - b)) % N;
    return ALPHABET[(newIdx + N) % N];
  }).join('');

  steps.push({
    title: 'Розшифрування',
    description: `Обернений ключ: a⁻¹ = ${aInv}, формула: P = ${aInv} × (C - ${b}) mod ${N}`,
  });

  return { encrypted, decrypted, steps };
}
