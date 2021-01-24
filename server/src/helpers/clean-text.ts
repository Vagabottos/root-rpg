
import { truncate } from 'lodash';

const TRUNC_OPTS = () => ({ length: 50, omission: '' });

export function clean(str: string): string {
  return truncate(str, TRUNC_OPTS()).trim();
}
