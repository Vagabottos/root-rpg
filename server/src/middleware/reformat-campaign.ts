
import { HookContext } from '@feathersjs/feathers';
import { capitalize, cloneDeep, sample } from 'lodash';

import { ICampaign, IClearing, IContent, content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

export function randomTownName(): string {
  const firstNames = allContent.core.clearinggen.town.start;
  const endNames = allContent.core.clearinggen.town.end;

  const rnd = sample(firstNames) || 'Apple';
  const rnd2 = sample(endNames) || 'keep';

  const name = capitalize(rnd + rnd2);

  return name;
}

function createClearing(): IClearing {
  const clearing: IClearing = {
    name: randomTownName(),
    status: 'pristine',
    contestedBy: 'Denizens',
    controlledBy: 'The Marquise',
    eventRecord: {
      beforePlay: 'Something happened here.',
      visited: []
    },
    landscape: {
      clearingConnections: [],
      landmarks: 'A Big Tower',
      locations: 'A Big Park'
    },
    current: {
      ruler: 'Some Big Guy',
      conflicts: 'There is probably some stuff going down here.',
      overarchingIssue: 'We need to figure out why stuff is going down here.',
      dominantFaction: 'The Eyrie'
    },
    history: {
      founder: 'Founder bon Varenstein',
      legendaryFigures: [
        'Co-founder bon co-enstein',
        'Figureheadus Oblivious',
        'Captain Founderpants'
      ],
      civilWarEvents: 'A war happened',
      interregnumEvents: 'A coup happened'
    }
  };

  return clearing;
}

export async function reformatCampaign(context: HookContext): Promise<HookContext> {

  const newCampaign: ICampaign = {
    name: context.data.name,
    locked: false,
    factions: [
      'Denizens',
      'The Marquisate',
      'The Eyrie'
    ],
    clearings: {},
    forests: {}
  };

  for(let i = 0; i < 12; i++) {
    const clearing = createClearing();
    newCampaign.clearings[clearing.name] = clearing;
  }

  // write this copy to the db
  context.data = newCampaign;

  return context;
}
