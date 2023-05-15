import type Prando from 'paima-sdk/paima-prando';

export function getRandomColor(rng: Prando) {
  const r = Math.floor(rng.next(0, 1) * 256);
  const g = Math.floor(rng.next(0, 1) * 256);
  const b = Math.floor(rng.next(0, 1) * 256);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}
