import { CipherResult, CipherStep } from './types';

// Simple SHA-256 implementation (synchronous)
function sha256(ascii: string): string {
    function rightRotate(value: number, amount: number) {
        return (value >>> amount) | (value << (32 - amount));
    }
    
    const words: number[] = [];
    const asciiLen = ascii.length * 8;
    const s = encoder.encode(ascii);
    
    for (let i = 0; i < s.length; i++) {
        words[i >> 2] |= s[i] << (24 - (i % 4) * 8);
    }
    
    words[s.length >> 2] |= 0x80 << (24 - (s.length % 4) * 8);
    words[(((s.length + 8) >> 6) << 4) + 15] = asciiLen;
    
    let hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    
    for (let i = 0; i < words.length; i += 16) {
        const w = words.slice(i, i + 16);
        for (let j = 16; j < 64; j++) {
            const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
            const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
            w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
        }
        
        let [a, b, c, d, e, f, g, h] = hash;
        
        for (let j = 0; j < 64; j++) {
            const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
            const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) | 0;
            
            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }
        
        hash = [
            (hash[0] + a) | 0, (hash[1] + b) | 0, (hash[2] + c) | 0, (hash[3] + d) | 0,
            (hash[4] + e) | 0, (hash[5] + f) | 0, (hash[6] + g) | 0, (hash[7] + h) | 0
        ];
    }
    
    return hash.map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
}

const encoder = new TextEncoder();

function power(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

export function rsaSign(text: string, nStr: string, dStr: string): CipherResult {
  const steps: CipherStep[] = [];
  
  if (!nStr || !dStr) throw new Error("Відсутні ключі (n, d)");
  
  const n = BigInt(nStr);
  const d = BigInt(dStr);
  
  // 1. Hash the message
  const hashHex = sha256(text);
  steps.push({
    title: 'Хешування (SHA-256)',
    description: `Повідомлення "${text}" хешовано. Результат (hex): ${hashHex}`
  });

  // 2. Convert hash to bigint
  const h = BigInt('0x' + hashHex);
  
  // 3. Sign the hash: s = h^d mod n
  const s = power(h, d, n);
  
  steps.push({
    title: 'Формування підпису',
    description: `Хеш перетворено в число h та обчислено підпис: s = h^d mod n. Результат: ${s.toString()}`
  });

  return { encrypted: s.toString(), decrypted: text, steps };
}

export function rsaVerify(text: string, signature: string, nStr: string, eStr: string): { isValid: boolean, steps: CipherStep[] } {
  const steps: CipherStep[] = [];
  
  if (!nStr || !eStr) throw new Error("Відсутні ключі (n, e)");
  
  const n = BigInt(nStr);
  const e = BigInt(eStr);
  const s = BigInt(signature);
  
  // 1. Recalculate hash of original message
  const hashHex = sha256(text);
  const targetH = BigInt('0x' + hashHex);
  
  steps.push({
    title: 'Хешування оригіналу',
    description: `Отримане повідомлення хешовано. Очікуваний хеш: ${hashHex}`
  });

  // 2. Verify signature: h' = s^e mod n
  const recoveredH = power(s, e, n);
  
  steps.push({
    title: 'Перевірка підпису',
    description: `Обчислено h' = s^e mod n. Отримане число: ${recoveredH.toString()}`
  });

  const isValid = recoveredH === targetH;
  
  steps.push({
    title: 'Результат перевірки',
    description: isValid 
      ? 'Числа співпадають! Підпис вірний, цілісність та авторство підтверджено.' 
      : 'Числа НЕ співпадають! Підпис невірний або повідомлення було змінено.'
  });

  return { isValid, steps };
}
