import { NotAcceptable } from '@feathersjs/errors';
import { IItem } from '../../../shared/interfaces';
import { clean } from './clean-text';


export function cleanItem(item: IItem): void {
  item.name = clean(item.name || '');
  if(!item.name) throw new NotAcceptable('No valid item name specified.');

  item.designation = clean(item.designation || '');
  item.hated = clean(item.hated || '');
  item.incendiary1 = clean(item.incendiary1 || '');
  item.incendiary2 = clean(item.incendiary2 || '');
  item.legendary1 = clean(item.legendary1 || '');
  item.legendary2 = clean(item.legendary2 || '');
}
