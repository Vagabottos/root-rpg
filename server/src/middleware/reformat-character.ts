
import { HookContext } from '@feathersjs/feathers';
import { NotAcceptable } from '@feathersjs/errors';
import { cloneDeep, isUndefined } from 'lodash';
import { ObjectId } from 'mongodb';

import { clean } from '../helpers/clean-text';

import { ICharacter, IContent, Stat, IItem, ICampaign, content } from '../interfaces';
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
    name: clean(context.data.character.name),
    campaign: context.data.campaign.campaignId,
    archetype: context.data.archetype.archetype,
    species: clean(context.data.character.customspecies || context.data.character.species),
    adjectives: context.data.character.adjectives.map(x => clean(x)),
    demeanor: context.data.character.demeanor.map(x => clean(x)),
    pronouns: clean(context.data.character.pronouns),
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

  if(!newChar.name) throw new NotAcceptable('Character must have a name.');
  if(!newChar.species) throw new NotAcceptable('Character must have a species.');
  if(newChar.adjectives.filter(Boolean).length === 0) throw new NotAcceptable('Character must have adjectives.');
  if(newChar.demeanor.filter(Boolean).length === 0) throw new NotAcceptable('Character must have demeanor.');
  if(!newChar.pronouns) throw new NotAcceptable('Character must have pronouns.');

  newChar.drives.forEach(drive => {
    if(content.core.drives[drive]) return;
    throw new NotAcceptable(`Invalid drive: ${drive}`);
  });

  if(!content.core.natures[newChar.nature]) throw new NotAcceptable(`Invalid nature: ${newChar.nature}`);

  const campaignService = context.app.service('campaign');
  let campaign!: ICampaign;

  if(newChar.campaign) {
    const { data } = await campaignService.find({
      query: {
        _id: new ObjectId(newChar.campaign),
        locked: { $ne: true },
        $limit: 1
      }
    });

    if(data) {
      campaign = data[0];
    }
  }

  // post-process items
  newChar.items.forEach(item => {
    item.name = clean(item.name);
    if(!item.name) throw new NotAcceptable('Items must all have a valid name.');
    reformatItem(item);
  });

  if(isUndefined(newChar.stats[context.data.bonus.stat])) throw new NotAcceptable('Bonus stat must be a valid stat.');

  // add bonus stat
  newChar.stats[context.data.bonus.stat as Stat] += 1;

  // set base reps
  if(campaign) {
    campaign.factions.forEach(fact => {
      newChar.reputation[fact] = { notoriety: 0, prestige: 0, total: 0 };
    });

  } else {
    allContent.core.factions.forEach(fact => {
      if(!fact.isDefault) return;
      newChar.reputation[fact.name] = { notoriety: 0, prestige: 0, total: 0 };
    });

  }

  // set background answers
  archetypeData.background.forEach((bg, i) => {
    const answer = context.data.background.backgrounds[i];

    if(bg.type === 'answers') {
      newChar.background[i] = {
        question: bg.question,
        answer: clean(answer.realText || answer.text)
      };

      if(!newChar.background[i].answer) throw new NotAcceptable(`Background question ${bg.question} must have an answer.`);
    }

    if(bg.type === 'faction') {
      newChar.background[i] = {
        question: bg.question,
        answer: clean(answer)
      };

      if(!newChar.background[i].answer) throw new NotAcceptable(`Background question ${bg.question} must have an answer.`);

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

  newChar.feats.forEach(feat => {
    if(content.core.feats[feat]) return;

    throw new NotAcceptable(`Invalid feat: ${feat}.`);
  })

  // set connections
  archetypeData.connections.forEach((conn, i) => {
    newChar.connections[i] = {
      name: conn.name,
      target: clean(context.data.connections.connections[i])
    };

    if(!newChar.connections[i].target) throw new NotAcceptable(`Connection ${conn.name} must have a target.`);
  });

  // write this copy to the db
  context.data = newChar;

  return context;
}
