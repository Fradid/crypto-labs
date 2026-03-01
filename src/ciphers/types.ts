export interface CipherResult {
  encrypted: string;
  decrypted: string;
  steps: CipherStep[];
}

export interface CipherStep {
  title: string;
  description: string;
  visualization?: MatrixVisualization | RailVisualization;
}

export interface MatrixVisualization {
  type: 'matrix';
  headers: string[];
  rows: string[][];
  readOrder?: number[];
  highlightCol?: number;
}

export interface RailVisualization {
  type: 'rail';
  rails: number;
  pattern: number[];
  chars: string[];
}

export type CipherType = 'caesar' | 'affine' | 'columnar' | 'railfence' | 'polybius' | 'gronsfeld' | 'playfair' | 'vernam' | 'des' | 'rsa' | 'rsa_sig';



export interface CipherConfig {
  name: string;
  description: string;
  keyType: 'number' | 'string' | 'pair' | 'rails';
  keyLabel: string;
  placeholder?: string;
  supportsAlphabet?: boolean;
}
