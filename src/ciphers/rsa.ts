import { CipherResult, CipherStep } from './types';

// RSA Algorithm using BigInt for large numbers
function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
}

function modInverse(e: bigint, phi: bigint): bigint {
  let [m0, y, x] = [phi, 0n, 1n];
  if (phi === 1n) return 0n;
  while (e > 1n) {
    let q = e / phi;
    let t = phi;
    phi = e % phi;
    e = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0n) x += m0;
  return x;
}

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

function isPrime(n: bigint, k: number = 5): boolean {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;

  let r = 0n;
  let d = n - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  for (let i = 0; i < k; i++) {
    let a = BigInt(Math.floor(Math.random() * (Number(n) - 4))) + 2n;
    let x = power(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let composite = true;
    for (let j = 0; j < Number(r) - 1; j++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

function getPrime(min: number, max: number): bigint {
  while (true) {
    let p = BigInt(Math.floor(Math.random() * (max - min)) + min);
    if (isPrime(p)) return p;
  }
}

export function generateRSAKeys(): { n: string, e: string, d: string, p: string, q: string } {
  // Use relatively small primes for browser efficiency but large enough for basic security demo
  let p = getPrime(1000, 5000);
  let q = getPrime(5000, 10000);
  while (p === q) q = getPrime(5000, 10000);

  let n = p * q;
  let phi = (p - 1n) * (q - 1n);
  
  let e = 65537n;
  if (gcd(e, phi) !== 1n) {
    e = 3n;
    while (gcd(e, phi) !== 1n) e += 2n;
  }

  let d = modInverse(e, phi);

  return {
    n: n.toString(),
    e: e.toString(),
    d: d.toString(),
    p: p.toString(),
    q: q.toString()
  };
}

export function rsaEncrypt(text: string, nStr: string, eStr: string): CipherResult {
  const steps: CipherStep[] = [];
  const encoder = new TextEncoder();
  
  if (!nStr || !eStr) throw new Error("Відсутні ключі (n, e)");
  
  const n = BigInt(nStr);
  const e = BigInt(eStr);
  const bytes = encoder.encode(text);
  
  steps.push({
    title: 'Підготовка (UTF-8)',
    description: `Текст "${text}" перетворено в байтовий масив: [${Array.from(bytes).join(', ')}]`
  });

  const encryptedValues: bigint[] = [];
  steps.push({
    title: 'Математичне зашифрування',
    description: `Для кожного байту m виконуємо: c = m^e mod n`
  });

  for (let i = 0; i < bytes.length; i++) {
    const m = BigInt(bytes[i]);
    const c = power(m, e, n);
    encryptedValues.push(c);
    
    if (i < 3) { // Show first few operations
      steps.push({
        title: `Шифрування байту ${i+1}`,
        description: `${m}^${e} mod ${n} = ${c}`
      });
    }
  }

  if (bytes.length > 3) {
    steps.push({
      title: '...',
      description: `Аналогічно для решти ${bytes.length - 3} байт(ів).`
    });
  }

  const encrypted = encryptedValues.join(' ');
  return { encrypted, decrypted: text, steps };
}

export function rsaDecrypt(encrypted: string, nStr: string, dStr: string): string {
  if (!nStr || !dStr) throw new Error("Відсутні ключі (n, d)");
  
  const n = BigInt(nStr);
  const d = BigInt(dStr);
  
  const parts = encrypted.trim().split(/\s+/);
  const decryptedBytes = new Uint8Array(parts.length);
  
  for (let i = 0; i < parts.length; i++) {
    const v = parts[i];
    if (!/^\d+$/.test(v)) {
      throw new Error(`Помилка: "${v}" не є числовим значенням RSA. Переконайтеся, що ви ввели зашифровані числа через пробіл.`);
    }
    decryptedBytes[i] = Number(power(BigInt(v), d, n));
  }

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBytes);
}
