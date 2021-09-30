
import { NotAcceptable } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { capitalize, cloneDeep, isArray, sample, sampleSize, shuffle, sortBy, random, uniq } from 'lodash';
import { INPC } from '../../../shared/interfaces';
import { ICampaign, IClearing, IContent, ClearingStatus, IContentMapLayout, ILake, content } from '../interfaces';
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
    corvid: false,
    cult: false,
    tradepost: false,
    tunnel: false,
    riverfolk: false,
    npcs: [],
    notes: '',
    eventRecord: {
      beforePlay: '',
      visited: []
    },
    landscape: {
      clearingConnections: [],
      landmarks: '', // sampleSize(content.core.clearinggen.building, 2).join(', '),
      locations: '',
    },
    current: {
      ruler: '',
      conflicts: '', // sampleSize(content.core.clearinggen.problem, 2).join(', '),
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

  // generateClearingNPC(campaign, clearing);
  // generateClearingNPC(campaign, clearing);

  return clearing;
}

function generateLakes(campaign: ICampaign, layout: IContentMapLayout) {

  const potentialCornerLakes = [
    { x: 1, y: 1, near: [] },
    { x: layout.maxX - 1, y: 1, near: [] },
    { x: 1, y: layout.maxY - 1, near: [] },
    { x: layout.maxX - 1, y: layout.maxY - 1, near: [] }
  ];

  const cornerLakes = sampleSize(potentialCornerLakes, 2);

  const numLakes = random(1, Math.floor(layout.lakeStartPositions.length / 2));
  const lakes = sampleSize(layout.lakeStartPositions, numLakes);

  const clearingsNearLakes = new Set<number>();

  const allLakes = [cornerLakes[0], ...lakes, cornerLakes[1]];
  allLakes.forEach((lake, i) => {
    const lakeData: ILake = {
      position: { x: lake.x / layout.maxX, y: lake.y / layout.maxY },
      connectedLakes: []
    };

    campaign.lakes.push(lakeData);

    if(i !== 0) {
      lakeData.connectedLakes.push(i - 1);
    }

    if(i !== allLakes.length - 1) {
      lakeData.connectedLakes.push(i + 1);
    }

    lake.near.forEach(x => clearingsNearLakes.add(x));
  });

  (campaign as any).clearingsNearLakes = [...clearingsNearLakes];
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

  generateLakes(campaign, layout);
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

function generateMarquisate(campaign: ICampaign, startCorner: number, takenCorners: number[]) {
  if(!campaign.factions.includes('The Marquisate')) return;

  const myCorner = campaign.clearings[startCorner];
  myCorner.controlledBy = 'The Marquisate (Keep)';
  addAuditLogEntry(campaign, myCorner.name, `Marquise built a base in ${myCorner.name}.`);

  const clearingsChecked = {
    [startCorner]: true
  };

  takenCorners.forEach(corner => clearingsChecked[corner] = true);

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

function generateEyrie(campaign: ICampaign, startCorner: number, takenCorners: number[]) {
  if(!campaign.factions.includes('The Eyrie Dynasties')) return;

  const myCorner = campaign.clearings[startCorner];
  myCorner.controlledBy = 'The Eyrie Dynasties (Roost)';
  addAuditLogEntry(campaign, myCorner.name, `Eyrie built a roost in ${myCorner.name}.`);

  const clearingsChecked = {
    [startCorner]: true
  };

  takenCorners.forEach(corner => clearingsChecked[corner] = true);

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

function generateCult(campaign: ICampaign, startCorner: number, takenCorners: number[]) {
  if(!campaign.factions.includes('The Lizard Cult')) return;

  const outcast = sample(['Fox', 'Rabbit', 'Mouse']);
  const clearings = sampleSize(campaign.clearings.filter(x => x.current.dominantFaction === outcast), 2);
  clearings.forEach(clearing => {
    clearing.cult = true;
    addAuditLogEntry(campaign, clearing.name, `Cult preyed on ${clearing.name}.`);
  });

  const myCorner = campaign.clearings[startCorner];
  myCorner.controlledBy = 'The Lizard Cult (Garden)';
  addAuditLogEntry(campaign, myCorner.name, `Cult formed a garden in ${myCorner.name}.`);
}

function generateRiverfolk(campaign: ICampaign) {
  if(!campaign.factions.includes('The Riverfolk Company')) return;

  const clearingsNearLakes = (campaign as any).clearingsNearLakes;
  delete (campaign as any).clearingsNearLakes;

  const clearingYeses = campaign.clearings.reduce((prev, cur, i) => {
    prev[i] = 0;

    if(cur.controlledBy) prev[i]++;
    if(cur.landscape.clearingConnections.length >= 3) prev[i]++;
    if(cur.landscape.clearingConnections.length >= 4) prev[i]++;
    if(clearingsNearLakes.includes(i)) prev[i]++;

    return prev;
  }, {});

  const clearingOrder = sortBy(campaign.clearings, x => clearingYeses[campaign.clearings.indexOf(x)]).reverse();

  let riverfolkCt = 0;
  let hasGivenPost = false;

  clearingOrder.forEach(clearing => {
    if(riverfolkCt >= 4) return;

    riverfolkCt++;

    clearing.riverfolk = true;
    addAuditLogEntry(campaign, clearing.name, `Riverfolk became present in ${clearing.name}.`);

    if(!hasGivenPost && !clearing.controlledBy.includes('(')) {
      hasGivenPost = true;
      clearing.controlledBy = 'The Riverfolk Company';
      clearing.tradepost = true;
      addAuditLogEntry(campaign, clearing.name, `Riverfolk took over ${clearing.name}.`);
    }

  });
}

function generateDuchy(campaign: ICampaign, startCorner: number, takenCorners: number[]) {
  if(!campaign.factions.includes('The Grand Duchy')) return;

  const myCorner = campaign.clearings[startCorner];
  myCorner.controlledBy = 'The Grand Duchy';
  myCorner.tunnel = true;
  addAuditLogEntry(campaign, myCorner.name, `Duchy sprung up in ${myCorner.name}.`);

  myCorner.landscape.clearingConnections.forEach(connection => {
    const clearing = campaign.clearings[connection];

    if(random(2, 12) <= 9) return;

    clearing.controlledBy = 'The Grand Duchy';
    addAuditLogEntry(campaign, myCorner.name, `Duchy took over ${myCorner.name}.`);
  });

  const tunnelClearing = sample(campaign.clearings.filter(x => x.controlledBy !== 'The Grand Duchy')) as IClearing;

  tunnelClearing.tunnel = true;
  addAuditLogEntry(campaign, tunnelClearing.name, `Duchy tunneled into ${myCorner.name}.`);

}

function generateCorvids(campaign: ICampaign) {
  if(!campaign.factions.includes('The Corvid Conspiracy')) return;

  const clearings = sampleSize(campaign.clearings, 4);
  clearings.forEach(clearing => {
    clearing.corvid = true;
    addAuditLogEntry(campaign, clearing.name, `Conspiracy descended on ${clearing.name}.`);
  });
}

function generateDenizens(campaign: ICampaign) {
  for(let i = 0; i < 12; i++) {
    const clearing = campaign.clearings[i];

    if(clearing.controlledBy === 'The Marquisate (Keep)') return;
    if(clearing.controlledBy === 'The Eyrie Dynasties (Roost)') return;
    if(clearing.controlledBy === 'The Woodland Alliance (Base)') return;

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
    look: '',
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
    lakes: [],
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
  const chosenCorner = sample(corners) as any;

  const cornerOrder = [chosenCorner.origin, chosenCorner.opposite, ...shuffle(chosenCorner.alts)];
  const relevantFactionsInOrder = ['The Marquisate', 'The Eyrie Dynasties', 'The Lizard Cult', 'The Grand Duchy'];

  const factionsInCampaign = relevantFactionsInOrder.filter(f => newCampaign.factions.includes(f));
  const cornerPerFaction = factionsInCampaign.reduce((prev, cur, i) => {
    prev[cur] = cornerOrder[i];
    return prev;
  }, {});

  const getFactionTakenCornerList = (faction: string): number[] => {
    return factionsInCampaign.slice(0, factionsInCampaign.indexOf(faction)).map(x => cornerPerFaction[x]);
  };

  generateMarquisate(newCampaign, cornerPerFaction['The Marquisate'], getFactionTakenCornerList('The Marquisate'));
  generateEyrie(newCampaign, cornerPerFaction['The Eyrie Dynasties'], getFactionTakenCornerList('The Eyrie Dynasties'));
  generateWoodland(newCampaign);
  generateCult(newCampaign, cornerPerFaction['The Lizard Cult'], getFactionTakenCornerList('The Lizard Cult'));
  generateRiverfolk(newCampaign);
  generateDuchy(newCampaign, cornerPerFaction['The Grand Duchy'], getFactionTakenCornerList('The Grand Duchy'));
  generateCorvids(newCampaign);
  generateDenizens(newCampaign);

  newCampaign.clearings.forEach(clearing => {
    if(clearing.eventRecord.beforePlay) return;

    clearing.eventRecord.beforePlay = `Denizens never lost control of ${clearing.name}.`;
  });

  // write this copy to the db
  context.data = newCampaign;

  return context;
}
