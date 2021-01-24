
import { Forbidden, NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

import { cloneDeep } from 'lodash';

import { clean } from '../helpers/clean-text';

import { ICharacter, IItem, IContent, content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

export function cleanItem(item: IItem): void {
  item.name = clean(item.name || '');
  if(!item.name) throw new NotAcceptable('No valid item name specified.');

  item.designation = clean(item.designation || '');
}

export async function cleanCharacter(context: HookContext): Promise<HookContext> {

  const character: Partial<ICharacter> = context.data;

  if(character.name) {
    character.name = clean(character.name || 'Name');
    if(!character.name) throw new NotAcceptable('No valid character name specified.');
  }

  if(character.species) {
    character.species = clean(character.species || 'axolotl');
    if(!character.species) throw new NotAcceptable('No valid character species specified.');
  }

  if(character.background) {
    character.background.forEach(bg => {
      bg.answer = clean(bg.answer);
      if(!bg.answer) throw new NotAcceptable(`Invalid background answer specified for ${bg.question}.`);
    });
  }

  if(character.drives) {
    character.drives.forEach(drive => {
      if(content.core.drives[drive]) return;
      throw new NotAcceptable(`Invalid drive: ${drive}`);
    });
  }

  if(character.moves) {
    character.moves.forEach(move => {
      if(content.core.moves[move]) return;
      throw new NotAcceptable(`Invalid move: ${move}`);
    });
  }

  if(character.feats) {
    character.feats.forEach(feat => {
      if(content.core.feats[feat]) return;
      throw new NotAcceptable(`Invalid feat: ${feat}`);
    });
  }

  if(character.skills) {
    character.skills.forEach(skill => {
      if(content.core.skills[skill]) return;
      throw new NotAcceptable(`Invalid skill: ${skill}`);
    });
  }

  if(character.moveSkills) {
    character.moveSkills.forEach(skill => {
      if(content.core.skills[skill]) return;
      throw new NotAcceptable(`Invalid skill: ${skill}`);
    });
  }

  if(character.nature) {
    if(!content.core.natures[character.nature]) {
      throw new NotAcceptable(`Invalid nature: ${character.nature}`);
    }
  }

  if(character.driveTargets) {
    Object.keys(character.driveTargets).forEach(drive => {
      if(!character.driveTargets) return;

      character.driveTargets[drive] = clean(character.driveTargets[drive]);
    });
  }

  if(character.connections) {
    character.connections.forEach(conn => {
      if(!content.core.connections[conn.name]) throw new NotAcceptable(`Invalid connection: ${conn.name}`);
      conn.target = clean(conn.target);
      if(!conn.target) throw new NotAcceptable(`No valid connection target specified for ${conn.name}.`);
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

  if(character.reputation) {
    Object.keys(character.reputation).forEach(repKey => {
      if(!repKey.includes('.')) return;
      throw new NotAcceptable('Faction names cannot have periods in them.');
    });
  }

  return context;
}
