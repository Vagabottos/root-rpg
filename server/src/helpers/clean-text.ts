
import { truncate } from 'lodash';

const TRUNC_OPTS = (length = 50) => ({ length, omission: '' });

export function clean(str: string, length?: number): string {
  return truncate(str, TRUNC_OPTS(length)).trim();
}
