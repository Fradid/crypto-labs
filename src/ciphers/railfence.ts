import { CipherResult, CipherStep, RailVisualization } from './types';

export function railFenceEncrypt(text: string, rails: number): CipherResult {
  const steps: CipherStep[] = [];

  if (rails < 2) {
    return { encrypted: text, decrypted: text, steps };
  }

  // Create fence pattern
  const fence: string[][] = Array(rails).fill(null).map(() => []);
  let rail = 0;
  let direction = 1;
  const pattern: number[] = [];

  for (const char of text) {
    fence[rail].push(char);
    pattern.push(rail);
    rail += direction;
    if (rail === rails - 1 || rail === 0) {
      direction *= -1;
    }
  }

  const viz: RailVisualization = {
    type: 'rail',
    rails,
    pattern,
    chars: text.split(''),
  };

  steps.push({
    title: 'Зигзаг-запис',
    description: `Текст записується по рейках зигзагом`,
    visualization: viz,
  });

  // Encrypt: read rows
  const encrypted = fence.map(r => r.join('')).join('');

  steps.push({
    title: 'Читання по рейках',
    description: `Зчитування зверху вниз: ${fence.map((r, i) => `Рейка ${i}: ${r.length} симв`).join(', ')}`,
  });

  // Decrypt
  const railLengths = fence.map(r => r.length);
  const railsContent: string[][] = [];
  let idx = 0;
  for (const len of railLengths) {
    railsContent.push(encrypted.slice(idx, idx + len).split(''));
    idx += len;
  }

  const decrypted: string[] = [];
  const railIndices = Array(rails).fill(0);
  rail = 0;
  direction = 1;

  for (let i = 0; i < text.length; i++) {
    decrypted.push(railsContent[rail][railIndices[rail]++]);
    rail += direction;
    if (rail === rails - 1 || rail === 0) {
      direction *= -1;
    }
  }

  return { encrypted, decrypted: decrypted.join(''), steps };
}
