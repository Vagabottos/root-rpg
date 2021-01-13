
import { HookContext } from '@feathersjs/feathers';
import { NotAcceptable } from '@feathersjs/errors';
import { cloneDeep } from 'lodash';

import { ICharacter, IContent, Stat, IItem, content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

export function reformatItem(item: IItem): void {
  if(item.tags?.includes('Luxury')) {
    item.extraValue = 3;
  }
}

export async function reformatCharacter(context: HookContext): Promise<HookContext> {

  const archetypeName = context.data?.archetype?.archetype;
  const archetypeData = allContent.vagabonds[archetypeName];
  if(!archetypeData) {
    throw new NotAcceptable(`Archetype ${archetypeName} does not exist.`);
  }

  const newChar: ICharacter = {
    name: context.data.character.name,
    campaign: context.data.campaignId,
    archetype: context.data.archetype.archetype,
    species: context.data.character.customspecies || context.data.character.species,
    adjectives: context.data.character.adjectives,
    demeanor: context.data.character.demeanor,
    pronouns: context.data.character.pronouns,
    background: [],
    drives: context.data.drives.drives,
    driveTargets: context.data.drives.driveTargets,
    nature: context.data.natures.nature,
    connections: [],
    stats: {
      [Stat.Charm]: archetypeData.stats[Stat.Charm],
      [Stat.Cunning]: archetypeData.stats[Stat.Cunning],
      [Stat.Finesse]: archetypeData.stats[Stat.Finesse],
      [Stat.Luck]: archetypeData.stats[Stat.Luck],
      [Stat.Might]: archetypeData.stats[Stat.Might]
    },
    feats: context.data.feats.feats,
    skills: context.data.skills.skills,
    moveSkills: context.data.skills.bonusSkills,
    moves: context.data.moves.moves,
    items: context.data.items.items,
    reputation: {},
    harm: {
      depletion: 0,
      exhaustion: 0,
      injury: 0
    },
    harmBoost: {
      depletion: 0,
      exhaustion: 0,
      injury: 0
    }
  };

  // post-process items
  newChar.items.forEach(item => {
    reformatItem(item);
  });

  // add bonus stat
  newChar.stats[context.data.bonus.stat as Stat] += 1;

  // set base reps
  allContent.core.factions.forEach(fact => {
    newChar.reputation[fact.name] = { notoriety: 0, prestige: 0, total: 0 };
  });

  // set background answers
  archetypeData.background.forEach((bg, i) => {
    const answer = context.data.background.backgrounds[i];

    if(bg.type === 'answers') {
      newChar.background[i] = {
        question: bg.question,
        answer: answer.realText || answer.text
      };
    }

    if(bg.type === 'faction') {
      newChar.background[i] = {
        question: bg.question,
        answer
      };

      const repChange = bg.reputation?.delta ?? 0;
      if(repChange < 0) {
        newChar.reputation[answer].notoriety += Math.abs(repChange);
      } else {
        newChar.reputation[answer].prestige += Math.abs(repChange);
      }
    }
  });

  // process rep changes from background questions
  (context.data.background.backgroundReps || []).forEach(rep => {
    if(!rep) return;

    const repChange = rep.delta ?? 0;
    if(repChange < 0) {
      newChar.reputation[rep.faction].notoriety += Math.abs(repChange);
    } else {
      newChar.reputation[rep.faction].prestige += Math.abs(repChange);
    }
  });

  // check and set feats
  if(newChar.feats.length === 0) {
    newChar.feats = archetypeData.feats.map(f => f.name);
  }

  // set connections
  archetypeData.connections.forEach((conn, i) => {
    newChar.connections[i] = {
      name: conn.name,
      target: context.data.connections.connections[i]
    };
  });

  // write this copy to the db
  context.data = newChar;

  return context;
}
