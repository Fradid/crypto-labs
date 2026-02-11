export const ALPHABETS = {
  ukr: 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ',
  eng: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

export type AlphabetType = keyof typeof ALPHABETS;

export const ALPHABET_LABELS: Record<AlphabetType, string> = {
  ukr: 'Українська',
  eng: 'English',
};
