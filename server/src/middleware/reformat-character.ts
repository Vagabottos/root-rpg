
import { HookContext } from '@feathersjs/feathers';
import { cloneDeep } from 'lodash';

import { ICharacter } from '../interfaces';
import { content } from '../interfaces';
const allContent = cloneDeep(content);

export async function reformatCharacter(context: HookContext): Promise<HookContext> {

  console.log('char', context.data);

  const newChar: Partial<ICharacter> = {

  };

  return context;
}
