import { NotAcceptable } from '@feathersjs/errors';
import { IItem } from '../../../shared/interfaces';
import { clean } from './clean-text';


export function cleanItem(item: IItem): void {
  item.name = clean(item.name || '');
  if(!item.name) throw new NotAcceptable('No valid item name specified.');

  item.designation = clean(item.designation || '');
  item.incendiary1 = clean(item.incendiary1 || '');
  item.incendiary2 = clean(item.incendiary2 || '');
}
