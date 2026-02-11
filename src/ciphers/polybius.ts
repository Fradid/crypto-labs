import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function polybiusEncrypt(text: string, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const steps: CipherStep[] = [];
  const ALPHABET = ALPHABETS[alphabetKey];
  
  // Create 5x5 or suitable grid
  // UKR: 33 items -> 6x6 grid (36 slots), last slots empty or special chars
  // ENG: 26 items -> 5x5 grid (25 slots), merge I/J or use 6x5??
  // Standard Polybius is 5x5.
  // For UKR (33 chars), we need 6x6 (36) or modify alphabet. 
  // Let's use a dynamic grid size closest to square root.

  const size = Math.ceil(Math.sqrt(ALPHABET.length));
  const grid: string[][] = [];
  let charIdx = 0;

  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      if (charIdx < ALPHABET.length) {
        row.push(ALPHABET[charIdx]);
        charIdx++;
      } else {
        row.push(' '); // padding
      }
    }
    grid.push(row);
  }

  steps.push({
    title: 'Квадрат Полібія',
    description: `Розмір сітки: ${size}x${size}`,
    visualization: {
      type: 'matrix',
      headers: Array.from({ length: size }, (_, i) => (i + 1).toString()),
      rows: grid,
      readOrder: [],
    }
  });

  const encrypted = text.split('').map(char => {
    const idx = ALPHABET.indexOf(char.toUpperCase());
    if (idx === -1) return char;
    
    // Find row and col
    const row = Math.floor(idx / size) + 1;
    const col = (idx % size) + 1;
    return `${row}${col}`;
  }).join(' ');

  steps.push({
    title: 'Зашифрування',
    description: 'Кожна літера замінюється координатами (рядок, стовпець) у квадраті.',
  });

  // Decryption for Polybius usually takes pairs of numbers
  // This simple implementation might need parsing logic adjustments if we want full reversibility from string 
  // but for now we follow the pattern of standard text operations.
  
  // Decryption logic assuming input is space-separated pairs "11 23 ..."
  const decrypted = encrypted.split(' ').map(pair => {
    if (pair.length < 2 || isNaN(parseInt(pair))) return pair;
    const r = parseInt(pair[0]) - 1;
    const c = parseInt(pair[1]) - 1;
    if (r >= 0 && r < size && c >= 0 && c < size) {
      return grid[r][c];
    }
    return pair;
  }).join('');

  return { encrypted, decrypted, steps };
}
