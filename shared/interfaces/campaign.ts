import { INPC } from './npc';

export type ClearingStatus = 'untouched' | 'battle-scarred' | 'occupied' | 'fortified';
export type ForestType = 'ruins' | 'creature' | 'mystery';
export type WarType = 'assault' | 'negotiation' | 'sabotage' | 'scarcity' | 'subversion' | 'minor ripples';

export interface IClearing {
  name: string;
  status: ClearingStatus;
  contestedBy: string;
  controlledBy: string;
  sympathy: boolean;
  npcs: INPC[];
  notes: string;

  position?: { x: number, y: number };

  eventRecord: {
    beforePlay: string;
    visited: IClearingVisitedEvent[];
  };

  landscape: {
    clearingConnections: number[];
    landmarks: string;
    locations: string;
  };

  current: {
    ruler: string;
    conflicts: string;
    overarchingIssue: string;
    dominantFaction: string;
  };

  history: {
    founder: string;
    legendaryFigures: string;
    civilWarEvents: string;
    interregnumEvents: string;
  };
}

export interface IForest {
  name: string;
  location: string;
  details: string;
  type: ForestType;
  position?: { x: number, y: number };
}

export interface ILake {
  position?: { x: number, y: number };
  connectedLakes: number[];
}

export interface IClearingVisitedEvent {
  timestamp: number;
  visitText: string;
  warContinuesText: string;
  warContinuesType: WarType;
}

export interface ISessionNotes {
  timestamp: number;
  notesText: string;
}

export interface IRequest {
  from: string;
  where: string;
  do: string;
  target: string;
}

export interface ICampaign {
  name: string;
  locked?: boolean;
  factions: string[];
  characterNames?: string[];
  notes: string;
  sessionNotes: ISessionNotes[];

  mapGen: {
    layout: string;
    flipX: boolean;
    flipY: boolean;
  };

  request: IRequest;

  clearings: IClearing[];
  forests: IForest[];
  lakes: ILake[];
  npcs: INPC[];
  allEvents: string[];

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
