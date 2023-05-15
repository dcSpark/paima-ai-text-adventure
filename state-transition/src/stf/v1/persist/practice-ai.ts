import type Prando from 'paima-sdk/paima-prando';

/**
 * Pseudo-random string generator
 * http://stackoverflow.com/a/27872144/383904
 * Default: return a random alpha-numeric string
 *
 * @param {Integer} len Desired length
 * @param {String} an Optional (alphanumeric), "a" (alpha), "n" (numeric)
 * @return {String}
 */
export function randomString(len: number, an?: string) {
  an = an && an.toLowerCase();
  let str = '',
    i = 0;
  const min = an == 'a' ? 10 : 0,
    max = an == 'n' ? 10 : 62;
  for (; i++ < len; ) {
    let r = (Math.random() * (max - min) + min) << 0;
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
}
//
// PracticeAI generates a move based on the current game state and prando.
//
export class PracticeAI {
  constructor(randomnessGenerator: Prando) {}

  // AI to generate next move
  //
  // Return string with next move
  // Return null to not send next move.
  public getNextMove(): string | null {
    return randomString(10);
  }
}
