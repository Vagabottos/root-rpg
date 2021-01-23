
import { Forbidden } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { truncate } from 'lodash';
import { ObjectId } from 'mongodb';

import { ICharacter, IItem } from '../interfaces';

const TRUNC_OPTS = () => ({ length: 50, omission: '' });

const clean = (str: string) => truncate(str, TRUNC_OPTS());

export function cleanItem(item: IItem): void {
  item.name = clean(item.name || '');
  item.designation = clean(item.designation || '');
}

export async function cleanCharacter(context: HookContext): Promise<HookContext> {

  const character: Partial<ICharacter> = context.data;

  if(character.name) {
    character.name = clean(character.name || 'Name');
  }

  if(character.species) {
    character.species = clean(character.species || 'axolotl');
  }

  if(character.background) {
    character.background.forEach(bg => {
      bg.answer = clean(bg.answer);
    });
  }

  if(character.driveTargets) {
    Object.keys(character.driveTargets).forEach(drive => {
      if(!character.driveTargets) return;

      character.driveTargets[drive] = clean(character.driveTargets[drive]);
    });
  }

  if(character.connections) {
    character.connections.forEach(conn => {
      conn.target = clean(conn.target);
    });
  }

  if(character.items) {
    character.items.forEach(item => cleanItem(item));
  }

  if(character.campaign) {

    if(character.campaign.length !== 24) {
      character.campaign = '';
    }

    if(character.campaign) {
      const campaignService = context.app.service('campaign');

      let res = null;

      try {
        res = await campaignService.find({
          query: {
            _id: new ObjectId(character.campaign),
            locked: { $ne: true },
            $limit: 0
          }
        });

      } catch {
        throw new Error('Could not join that campaign.');
      }

      if(res) {
        const { total } = res;
        if(total === 0) throw new Forbidden('Could not join that campaign.');
      }
    }

  }

  return context;
}
