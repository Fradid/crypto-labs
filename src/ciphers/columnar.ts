import { CipherResult, CipherStep, MatrixVisualization } from './types';

export function columnarEncrypt(text: string, key: string): CipherResult {
  const steps: CipherStep[] = [];
  const keyLen = key.length;

  // Padding
  const padding = (keyLen - (text.length % keyLen)) % keyLen;
  const paddedText = text + ' '.repeat(padding);

  // Create matrix
  const rows = Math.ceil(paddedText.length / keyLen);
  const matrix: string[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(paddedText.slice(i * keyLen, (i + 1) * keyLen).split(''));
  }

  // Determine column order
  const indexed = key.split('').map((char, i) => ({ char, idx: i }));
  indexed.sort((a, b) => a.char.localeCompare(b.char));
  const order = indexed.map(item => item.idx);

  const viz: MatrixVisualization = {
    type: 'matrix',
    headers: key.split(''),
    rows: matrix,
    readOrder: order,
  };

  steps.push({
    title: 'Формування матриці',
    description: `Текст записується по рядках у матрицю ${rows}×${keyLen}`,
    visualization: viz,
  });

  // Encrypt: read columns in order
  let encrypted = '';
  const readOrder: number[] = [];
  for (let i = 0; i < keyLen; i++) {
    const colIdx = order[i];
    readOrder.push(colIdx);
    for (let r = 0; r < rows; r++) {
      encrypted += matrix[r][colIdx];
    }
  }

  steps.push({
    title: 'Читання по стовпцях',
    description: `Порядок читання: ${readOrder.map(i => key[i]).join(' → ')}`,
  });

  // Decrypt
  const decryptedMatrix: string[][] = Array(rows).fill(null).map(() => Array(keyLen).fill(''));
  let idx = 0;
  for (let i = 0; i < keyLen; i++) {
    const colIdx = order.indexOf(i);
    for (let r = 0; r < rows; r++) {
      decryptedMatrix[r][colIdx] = encrypted[idx++];
    }
  }
  const decrypted = decryptedMatrix.map(row => row.join('')).join('').trimEnd();

  return { encrypted, decrypted, steps };
}
