
import { HookContext } from '@feathersjs/feathers';

import { IItem } from '../interfaces';

export function cleanItem(item: IItem): void {

}

export async function cleanCharacter(context: HookContext): Promise<HookContext> {

  return context;
}
