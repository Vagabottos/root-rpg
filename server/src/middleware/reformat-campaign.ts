
import { NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { capitalize, cloneDeep, isArray, sample, sampleSize, shuffle, random, uniq } from 'lodash';
import { INPC } from '../../../shared/interfaces';
import { ICampaign, IClearing, IContent, ClearingStatus, IContentMapLayout, content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

const NUM_CLEARINGS = 12;
const MAX_ATTEMPTS = 25;
const MIN_CONNECTIONS = 2;
const MAX_CONNECTIONS = 5;

export function randomTownName(): string {
  const firstNames = allContent.core.clearinggen.town.start;
  const endNames = allContent.core.clearinggen.town.end;

  const rnd = sample(firstNames) || 'Apple';
  const rnd2 = sample(endNames) || 'keep';

  const name = capitalize(rnd + rnd2);

  return name;
}

function createClearing(campaign: ICampaign): IClearing {
  const clearing: IClearing = {
    name: randomTownName(),
    status: sample(['untouched', 'battle-scarred', 'occupied', 'fortified']) as ClearingStatus,
    contestedBy: '',
    controlledBy: '',
    npcs: [],
    notes: '',
    eventRecord: {
      beforePlay: 'Something happened here.',
      visited: []
    },
    landscape: {
      clearingConnections: [],
      landmarks: sampleSize(content.core.clearinggen.building, 2).join(', '),
      locations: '',
    },
    current: {
      ruler: '',
      conflicts: sampleSize(content.core.clearinggen.problem, 2).join(', '),
      overarchingIssue: '',
      dominantFaction: ''
    },
    history: {
      founder: 'Founder bon Varenstein',
      legendaryFigures: `
Co-founder bon co-enstein
Figureheadus Oblivious
Captain Founderpants
      `,
      civilWarEvents: 'A war happened',
      interregnumEvents: 'A coup happened'
    }
  };

  generateClearingNPC(campaign, clearing);
  generateClearingNPC(campaign, clearing);

  return clearing;
}

function generateConnections(campaign: ICampaign) {
  const layoutName = sample(Object.keys(allContent.core.maplayouts)) as string;
  const layout: IContentMapLayout = allContent.core.maplayouts[layoutName];

  campaign.mapGen.layout = layoutName;

  const potentialEdges = {};

  layout.connections.forEach(({ path, blocks }) => {
    const [start, end] = path.split('-');
    const allBlocks = (blocks || [])
      .map((b) => [b, b.split('-').reverse().join('-')])
      .flat(Infinity);

    potentialEdges[start] = potentialEdges[start] || {};
    potentialEdges[start][end] = allBlocks;

    potentialEdges[end] = potentialEdges[end] || {};
    potentialEdges[end][start] = allBlocks;
  });

  let attempts = 0;
  let chosenEdges = {};
  let blockedEdges = {};
  let edgesPerClearing = {};

  while (attempts++ < MAX_ATTEMPTS) {
    chosenEdges = {};
    blockedEdges = {};
    edgesPerClearing = Object.fromEntries(Array(NUM_CLEARINGS).fill(0).map((x, i) => [i, 0]));

    let isValid = true;

    // create paths for each node
    shuffle(Array(NUM_CLEARINGS).fill(0).map((x, i) => i)).forEach((i) => {
      const paths = random(MIN_CONNECTIONS, MAX_CONNECTIONS);
      for (let p = 0; p < paths; p++) {
        const curNodeEdges = potentialEdges[i];
        const possibleNewEdges = Object.keys(curNodeEdges || {})
          .filter((e) => !blockedEdges[`${e}-${i}`] && !blockedEdges[`${i}-${e}`]
                      && !chosenEdges[`${e}-${i}`] && !chosenEdges[`${i}-${e}`]
                      && edgesPerClearing[e] < MAX_CONNECTIONS && edgesPerClearing[i] < MAX_CONNECTIONS);
        const edge = sample(possibleNewEdges);

        if (edge) {
          chosenEdges[`${i}-${edge}`] = true;
          chosenEdges[`${edge}-${i}`] = true;

          edgesPerClearing[i]++;
          edgesPerClearing[edge]++;

          potentialEdges[i][edge].forEach((block) => {
            blockedEdges[block] = true;
          });
        }
      }
    });

    // validate # connections per clearing
    if (Object.values(edgesPerClearing).some((v: any) => v < MIN_CONNECTIONS || v > MAX_CONNECTIONS)) {
      isValid = false;
    }

    if (isValid) { break; }
  }

  const oneWayEdges = {};
  Object.keys(chosenEdges).forEach((key) => {
    const [start, end] = key.split('-');
    if (oneWayEdges[`${end}-${start}`]) { return; }
    oneWayEdges[`${start}-${end}`] = true;
  });

  Object.keys(oneWayEdges).forEach(edge => {
    const [start, end] = edge.split('-').map(x => +x);
    campaign.clearings[start].landscape.clearingConnections.push(end);
    campaign.clearings[end].landscape.clearingConnections.push(start);
  });
}

function generateCommunities(campaign: ICampaign) {
  const order = shuffle([
    'Rabbit', 'Rabbit', 'Rabbit', 'Rabbit',
    'Mouse', 'Mouse', 'Mouse', 'Mouse',
    'Fox', 'Fox', 'Fox', 'Fox'
  ]);

  campaign.clearings.forEach((clearing, i) => {
    clearing.current.dominantFaction = order[i];
  });
}

function generateNames(campaign: ICampaign) {
  let names = Array(12).fill(null).map(() => randomTownName());
  while(!uniq(names)) {
    names = Array(12).fill(null).map(() => randomTownName());
  }

  campaign.clearings.forEach((x, i) => x.name = names[i]);
}

function generateMarquisate(campaign: ICampaign) {
  // set controlledBy (add "marquise (with keep) to controlled by list)
}

function generateEyrie(campaign: ICampaign) {
  // set controlledBy (add "eyrie (with roost)" to controlled by list)
}

function generateWoodland(campaign: ICampaign) {
  // set controlledBy (add "woodland (with base)" to controlled by list)
}

function generateDenizens(campaign: ICampaign) {
  // set controlledBy (add "uncontrolled" to controlled by list)
}

function generateClearingNPC(campaign: ICampaign, clearing: IClearing) {

  const npc: INPC = {
    name: sample(content.core.names) as string,
    faction: sample(campaign.factions) as string,
    look: 'like a goat',
    job: sample(content.core.clearinggen.inhabitant) as string,
    drive: sample(content.core.npcdrives) as string,
    attack: '1 injury',
    equipment: [],
    notes: '',
    harm: {
      depletion: 0,
      exhaustion: 0,
      injury: 0,
      morale: 0
    },
    harmMax: {
      depletion: random(0, 5),
      exhaustion: random(0, 5),
      injury: random(0, 5),
      morale: random(0, 5)
    }
  };

  clearing.npcs.push(npc);
}

export async function reformatCampaign(context: HookContext): Promise<HookContext> {

  context.data.factions = context.data.factions || [];
  context.data.factions = context.data.factions.filter(Boolean);

  if(context.data.factions.length === 0 || !isArray(context.data.factions)) {
    throw new NotAcceptable('No factions specified for campaign gen.');
  }

  if(context.data.factions.some(f => f.includes('.'))) throw new NotAcceptable('Campaign factions cannot have a period in them.');

  const newCampaign: ICampaign = {
    name: context.data.name,
    locked: false,
    notes: '',
    sessionNotes: [],
    mapGen: {
      layout: '',
      flipX: sample([true, false]) as boolean,
      flipY: sample([true, false]) as boolean
    },
    factions: context.data.factions,
    clearings: [],
    forests: [],
    npcs: []
  };

  for(let i = 0; i < NUM_CLEARINGS; i++) {
    const clearing = createClearing(newCampaign);
    newCampaign.clearings.push(clearing);
  }

  generateNames(newCampaign);
  generateConnections(newCampaign);
  generateCommunities(newCampaign);
  generateMarquisate(newCampaign);
  generateEyrie(newCampaign);
  generateWoodland(newCampaign);
  generateDenizens(newCampaign);

  // write this copy to the db
  context.data = newCampaign;

  return context;
}
