
import { HookContext } from '@feathersjs/feathers';
import { NotAcceptable } from '@feathersjs/errors';
import { cloneDeep } from 'lodash';

import { ICharacter, IContent } from '../interfaces';
import { content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

export async function reformatCharacter(context: HookContext): Promise<HookContext> {

  console.log('char', context.data);

  const archetypeName = context.data?.archetype?.archetype;
  const archetypeData = allContent.vagabonds[archetypeName];
  if(!archetypeData) {
    throw new NotAcceptable(`Archetype ${archetypeName} does not exist.`);
  }

  // TODO: validate campaignId

  const newChar: Partial<ICharacter> = {
    name: context.data.character.name,
    campaign: context.data.campaignId,
    archetype: context.data.archetype.archetype,
    adjectives: context.data.character.adjectives,
    pronouns: context.data.character.pronouns,
    demeanor: context.data.character.demeanor,
    species: context.data.character.species
  };

  return context;
}
