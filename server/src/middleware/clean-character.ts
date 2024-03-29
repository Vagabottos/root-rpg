
import { Forbidden, NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { ObjectId } from 'mongodb';

import { cloneDeep } from 'lodash';

import { clean } from '../helpers/clean-text';

import { ICharacter, IContent, content } from '../interfaces';
import { cleanItem } from '../helpers/clean-item';
const allContent: IContent = cloneDeep(content);

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

  if(character.portrait) {
    character.portrait = clean(character.portrait, 25);
  }

  if(character.demeanor) {
    character.demeanor = character.demeanor.map(x => clean(x, 25));
  }

  if(character.adjectives) {
    character.adjectives = character.adjectives.map(x => clean(x, 25));
  }

  if(character.keepsakes) {
    character.keepsakes = character.keepsakes.map(x => clean(x, 25));
  }

  if(character.drives) {
    character.drives.forEach(drive => {
      if(allContent.core.drives[drive]) return;
      throw new NotAcceptable(`Invalid drive: ${drive}`);
    });
  }

  if(character.moves) {
    character.moves.forEach(move => {
      if(allContent.core.moves[move]) return;
      throw new NotAcceptable(`Invalid move: ${move}`);
    });
  }

  if(character.feats) {
    character.feats.forEach(feat => {
      if(allContent.core.feats[feat]) return;
      throw new NotAcceptable(`Invalid feat: ${feat}`);
    });
  }

  if(character.skills) {
    character.skills.forEach(skill => {
      if(allContent.core.skills[skill]) return;
      throw new NotAcceptable(`Invalid skill: ${skill}`);
    });
  }

  if(character.moveSkills) {
    character.moveSkills.forEach(skill => {
      if(allContent.core.skills[skill]) return;
      throw new NotAcceptable(`Invalid skill: ${skill}`);
    });
  }

  if(character.nature) {
    if(!allContent.core.natures[character.nature]) {
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
      if(!allContent.core.connections[conn.name]) throw new NotAcceptable(`Invalid connection: ${conn.name}`);
      conn.target = clean(conn.target);
      conn.text = clean(conn.text, 500);
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

  if(character.notes) {
    character.notes = clean(character.notes, 10000);
  }

  return context;
}
