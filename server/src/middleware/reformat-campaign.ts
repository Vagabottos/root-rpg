
import { NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { capitalize, cloneDeep, isArray, sample, sampleSize, shuffle, random, uniq } from 'lodash';
import { INPC } from '../../../shared/interfaces';
import { ICampaign, IClearing, IContent, ClearingStatus, IContentMapLayout, content } from '../interfaces';
const allContent: IContent = cloneDeep(content);

const NUM_CLEARINGS = 12;
const MAX_ATTEMPTS = 25;
const MIN_CONNECTIONS = 1;
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
    controlledBy: 'Uncontrolled',
    sympathy: false,
    npcs: [],
    notes: '',
    eventRecord: {
      beforePlay: '',
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

function addAuditLogEntry(campaign: ICampaign, clearing: string, message: string) {
  campaign.allEvents.push(message);

  const clearingRef = campaign.clearings.find(x => x.name === clearing);
  if(clearingRef) {
    clearingRef.eventRecord.beforePlay += message + ' ';
  }
}

function generateNames(campaign: ICampaign) {
  let names = Array(12).fill(null).map(() => randomTownName());
  while(!uniq(names)) {
    names = Array(12).fill(null).map(() => randomTownName());
  }

  campaign.clearings.forEach((x, i) => x.name = names[i]);
}

function generateMarquisate(campaign: ICampaign, startCorner: { origin: number, opposite: number }) {
  if(!campaign.factions.includes('The Marquisate')) return;

  const myCorner = campaign.clearings[startCorner.origin];
  myCorner.controlledBy = 'The Marquisate (Keep)';
  addAuditLogEntry(campaign, myCorner.name, `Marquise built a base in ${myCorner.name}.`);

  const clearingsChecked = {
    [startCorner.origin]: true
  };

  // this should really be recursive / bfs but meh
  myCorner.landscape.clearingConnections.forEach(connected => {
    if(clearingsChecked[connected]) return;
    clearingsChecked[connected] = true;

    if(random(2, 12) <= 4) return;
    campaign.clearings[connected].controlledBy = 'The Marquisate';
    addAuditLogEntry(campaign, campaign.clearings[connected].name, `Marquise influence spread from ${myCorner.name} to ${campaign.clearings[connected].name}.`);

    // dist of 2
    campaign.clearings[connected].landscape.clearingConnections.forEach(connected2 => {
      if(clearingsChecked[connected2]) return;
      clearingsChecked[connected2] = true;

      if(random(2, 12) <= 6) return;
      campaign.clearings[connected2].controlledBy = 'The Marquisate';
      addAuditLogEntry(campaign, campaign.clearings[connected2].name, `Marquise influence spread from ${campaign.clearings[connected].name} to ${campaign.clearings[connected2].name}.`);

      // dist of 3
      campaign.clearings[connected2].landscape.clearingConnections.forEach(connected3 => {
        if(clearingsChecked[connected3]) return;
        clearingsChecked[connected3] = true;

        if(random(2, 12) <= 9) return;
        campaign.clearings[connected3].controlledBy = 'The Marquisate';
        addAuditLogEntry(campaign, campaign.clearings[connected3].name, `Marquise influence spread from ${campaign.clearings[connected2].name} to ${campaign.clearings[connected3].name}.`);

        // dist of 4
        campaign.clearings[connected3].landscape.clearingConnections.forEach(connected4 => {
          if(clearingsChecked[connected4]) return;
          clearingsChecked[connected4] = true;

          if(random(2, 12) <= 11) return;
          campaign.clearings[connected4].controlledBy = 'The Marquisate';
          addAuditLogEntry(campaign, campaign.clearings[connected4].name, `Marquise influence spread from ${campaign.clearings[connected3].name} to ${campaign.clearings[connected4].name}.`);
        });
      });
    });
  });
}

function generateEyrie(campaign: ICampaign, startCorner: { origin: number, opposite: number }) {
  if(!campaign.factions.includes('The Eyrie Dynasties')) return;

  const myCorner = campaign.clearings[startCorner.opposite];
  myCorner.controlledBy = 'The Eyrie Dynasties (Roost)';
  addAuditLogEntry(campaign, myCorner.name, `Eyrie built a roost in ${myCorner.name}.`);

  const clearingsChecked = {
    [startCorner.opposite]: true,
    [startCorner.origin]: true
  };

  let roosts = 1;

  // this should really be recursive / bfs but meh
  myCorner.landscape.clearingConnections.forEach(connected => {
    if(clearingsChecked[connected]) return;
    clearingsChecked[connected] = true;

    const roll = random(2, 12);
    if(roll <= 5) return;
    const hasRoost = roll >= 9 && roosts < 4;
    const controller = hasRoost ? 'The Eyrie Dynasties (Roost)' : 'The Eyrie Dynasties';
    if(campaign.clearings[connected].controlledBy) campaign.clearings[connected].contestedBy = 'Eyrie';
    campaign.clearings[connected].controlledBy = controller;

    addAuditLogEntry(campaign, campaign.clearings[connected].name, `Eyrie ${campaign.clearings[connected].contestedBy ? 'took over' : 'expanded to'} ${campaign.clearings[connected].name}${hasRoost ? ' and built a roost' : ''}.`);

    if(roll >= 9) roosts++;

    // dist of 2
    campaign.clearings[connected].landscape.clearingConnections.forEach(connected2 => {
      if(clearingsChecked[connected2]) return;
      clearingsChecked[connected2] = true;

      const roll = random(2, 12);
      if(roll <= 8) return;
      const hasRoost = roll >= 11 && roosts < 4;
      const controller = roll >= 11 && roosts < 4 ? 'The Eyrie Dynasties (Roost)' : 'The Eyrie Dynasties';
      if(campaign.clearings[connected2].controlledBy) campaign.clearings[connected2].contestedBy = 'Eyrie';
      campaign.clearings[connected2].controlledBy = controller;

      addAuditLogEntry(campaign, campaign.clearings[connected2].name, `Eyrie ${campaign.clearings[connected2].contestedBy ? 'took over' : 'expanded to'} ${campaign.clearings[connected2].name}${hasRoost ? ' and built a roost' : ''}.`);

      if(roll >= 11) roosts++;

      // dist of 3
      campaign.clearings[connected2].landscape.clearingConnections.forEach(connected3 => {
        if(clearingsChecked[connected3]) return;
        clearingsChecked[connected3] = true;

        const roll = random(2, 12);
        if(roll <= 10) return;
        const controller = roll >= 12 && roosts < 4 ? 'The Eyrie Dynasties (Roost)' : 'The Eyrie Dynasties';
        if(campaign.clearings[connected3].controlledBy) campaign.clearings[connected3].contestedBy = 'Eyrie';
        campaign.clearings[connected3].controlledBy = controller;

        addAuditLogEntry(campaign, campaign.clearings[connected3].name, `Eyrie ${campaign.clearings[connected3].contestedBy ? 'took over' : 'expanded to'} ${campaign.clearings[connected3].name}${hasRoost ? ' and built a roost' : ''}.`);

        if(roll >= 12) roosts++;
      });
    });
  });
}

function generateWoodland(campaign: ICampaign) {
  if(!campaign.factions.includes('The Woodland Alliance')) return;

  for(let i = 0; i < 12; i++) {
    const clearing = campaign.clearings[i];

    const roll = random(2, 12);
    if(clearing.controlledBy && roll >= 11)   { clearing.sympathy = true; }
    if(!clearing.controlledBy && roll >= 9)   { clearing.sympathy = true; }
    if(clearing.contestedBy && roll >= 8)     { clearing.sympathy = true; }

    if(clearing.sympathy) {
      addAuditLogEntry(campaign, clearing.name, `Alliance garnered sympathy in ${clearing.name}.`);
    }
  }

  let didRevolt = false;

  for(let i = 0; i < 12; i++) {
    if(didRevolt) continue;

    const clearing = campaign.clearings[i];
    if(!clearing.sympathy) continue;

    const roll = random(2, 12);
    if(roll < 10) continue;

    didRevolt = true;
    clearing.controlledBy = 'The Woodland Alliance (Base)';
    addAuditLogEntry(campaign, clearing.name, `Alliance revolted in ${clearing.name}.`);

    if(roll === 12) {
      clearing.landscape.clearingConnections.forEach(conn => {
        campaign.clearings[conn].sympathy = true;
        addAuditLogEntry(campaign, clearing.name, `Alliance garnered sympathy in ${campaign.clearings[conn].name} from their base in ${clearing.name}.`);
      });
    }
  }
}

function generateDenizens(campaign: ICampaign) {
  for(let i = 0; i < 12; i++) {
    const clearing = campaign.clearings[i];

    if(clearing.controlledBy?.includes('(') && random(2, 12) >= 11) {
      clearing.controlledBy = '';
      addAuditLogEntry(campaign, clearing.name, `Denizens retook control of ${clearing.name}.`);

    }
  }
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
    request: {
      do: '',
      from: '',
      where: '',
      target: ''
    },
    mapGen: {
      layout: '',
      flipX: sample([true, false]) as boolean,
      flipY: sample([true, false]) as boolean
    },
    factions: context.data.factions,
    clearings: [],
    forests: [],
    npcs: [],
    allEvents: []
  };

  for(let i = 0; i < NUM_CLEARINGS; i++) {
    const clearing = createClearing(newCampaign);
    newCampaign.clearings.push(clearing);
  }

  generateNames(newCampaign);
  generateConnections(newCampaign);
  generateCommunities(newCampaign);

  const corners = allContent.core.maplayouts[newCampaign.mapGen.layout].corners;
  const chosenCorner = sample(corners);

  generateMarquisate(newCampaign, chosenCorner as any);
  generateEyrie(newCampaign, chosenCorner as any);
  generateWoodland(newCampaign);
  generateDenizens(newCampaign);

  newCampaign.clearings.forEach(clearing => {
    if(clearing.eventRecord.beforePlay) return;

    clearing.eventRecord.beforePlay = `Denizens never lost control of ${clearing.name}.`;
  });

  // write this copy to the db
  context.data = newCampaign;

  return context;
}
