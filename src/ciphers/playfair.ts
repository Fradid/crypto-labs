import { CipherResult, CipherStep } from './types';
import { ALPHABETS, AlphabetType } from './alphabets';

export function playfairEncrypt(text: string, key: string, alphabetKey: AlphabetType = 'ukr'): CipherResult {
  const steps: CipherStep[] = [];
  const sourceAlphabet = ALPHABETS[alphabetKey];
  const isEng = alphabetKey === 'eng';
  
  // Prepare key and alphabet
  // Remove duplicates from key, then append rest of alphabet
  const cleanKey = Array.from(new Set(key.toUpperCase().split(''))).filter(c => sourceAlphabet.includes(c));
  const remainingChars = sourceAlphabet.split('').filter(c => !cleanKey.includes(c));
  
  let gridChars = [...cleanKey, ...remainingChars];
  
  // Handle I/J for English (merge I/J)
  if (isEng) {
    gridChars = gridChars.filter(c => c !== 'J'); // Remove J from grid, we'll map J to I in text
  } else {
    // For Ukr (33 chars), we strictly need 36 slots for 6x6.
    // Standard approach: add logical padding or specific chars.
    // We will pad with ' ' or digits if we want to fill 6x6 (36). 
    // Let's just create the grid and handle potentially empty slots safely or fill with standard extensions if needed.
    // 33 letters fit in 6x6 (36) with 3 empty.
    // Let's allow numbers 0,1,2 to fill it? Or just leave them.
    // A common variant uses ' ' or symbols. Let's use '.', ',', '-' to fill 3 spots?
    // Or just 0, 1, 2. Let's use '.', ',', '-' for neutrality.
    while (gridChars.length < 36) {
      gridChars.push(String.fromCharCode(gridChars.length)); // Placeholder
    }
  }

  const size = isEng ? 5 : 6;
  const grid: string[][] = [];
  for (let i = 0; i < size; i++) {
    grid.push(gridChars.slice(i * size, (i + 1) * size));
  }

  steps.push({
    title: 'Матриця шифрування',
    description: `Розмір: ${size}x${size}. Ключ: ${key}`,
    visualization: {
      type: 'matrix',
      headers: Array.from({ length: size }, (_, i) => (i + 1).toString()),
      rows: grid,
    }
  });

  // Prepare text (pairs)
  let cleanText = text.toUpperCase().split('').filter(c => sourceAlphabet.includes(c));
  if (isEng) {
    cleanText = cleanText.map(c => c === 'J' ? 'I' : c);
  }

  const pairs: string[] = [];
  const paddingChar = isEng ? 'X' : 'Х'; // Ukrainian 'Kh' matches visual, or uses 'Я' etc. 'Х' is standard filler.
  
  for (let i = 0; i < cleanText.length; i++) {
    const a = cleanText[i];
    let b = '';
    
    if (i + 1 < cleanText.length) {
      b = cleanText[i + 1];
    } else {
      b = paddingChar; // End of text padding
      pairs.push(a + b);
      break;
    }

    if (a === b) {
      pairs.push(a + paddingChar);
      // We do NOT increment i extra, because we "inserted" a char, meaning the next char in valid text is still at i+1
      // actually standard playfair: inserts X between double letters.
      // So 'HELLO' -> 'HE', 'LX', 'LO'
      // loop needs to handle this insertion.
      continue;
    } else {
      pairs.push(a + b);
      i++; // Skip the next char as we used it
    }
  }

  steps.push({
    title: 'Підготовка біграм',
    description: `Текст розбито на пари: ${pairs.join(' ')}`,
  });

  // Encrypt pairs
  const encryptedPairs = pairs.map(pair => {
    const [a, b] = pair.split('');
    let r1 = 0, c1 = 0, r2 = 0, c2 = 0;

    // Find coords
    // Optimization: create map but linear search is fine for 36 items
    for(let r=0; r<size; r++) {
      for(let c=0; c<size; c++) {
        if (grid[r][c] === a) { r1 = r; c1 = c; }
        if (grid[r][c] === b) { r2 = r; c2 = c; }
      }
    }

    if (r1 === r2) {
      // Row - shift right
      return grid[r1][(c1 + 1) % size] + grid[r2][(c2 + 1) % size];
    } else if (c1 === c2) {
      // Col - shift down
      return grid[(r1 + 1) % size][c1] + grid[(r2 + 1) % size][c2];
    } else {
      // Rect - swap cols
      return grid[r1][c2] + grid[r2][c1];
    }
  });

  const encrypted = encryptedPairs.join('');

  steps.push({
    title: 'Шифрування',
    description: 'Правила: рядок -> вправо, стовпець -> вниз, прямокутник -> протилежні кути по рядку.',
  });

  // Decryption Logic (Reversed)
  const decryptedPairs = encryptedPairs.map(pair => {
    const [a, b] = pair.split('');
    let r1 = 0, c1 = 0, r2 = 0, c2 = 0;

    for(let r=0; r<size; r++) {
      for(let c=0; c<size; c++) {
        if (grid[r][c] === a) { r1 = r; c1 = c; }
        if (grid[r][c] === b) { r2 = r; c2 = c; }
      }
    }

    if (r1 === r2) {
      // Row - shift left
      return grid[r1][(c1 - 1 + size) % size] + grid[r2][(c2 - 1 + size) % size];
    } else if (c1 === c2) {
      // Col - shift up
      return grid[(r1 - 1 + size) % size][c1] + grid[(r2 - 1 + size) % size][c2];
    } else {
      // Rect - swap cols (same as encrypt)
      return grid[r1][c2] + grid[r2][c1];
    }
  });

  const decrypted = decryptedPairs.join('');

  return { encrypted, decrypted, steps };
}
