import { INPC } from './npc';

export type ClearingStatus = 'pristine' | 'damaged' | 'wrecked' | 'destroyed';
export type ForestType = 'ruins' | 'creature' | 'mystery';
export type WarType = 'assault' | 'negotiation' | 'sabotage' | 'scarcity' | 'subversion' | 'minor ripples';

export interface IClearing {
  name: string;
  status: ClearingStatus;
  contestedBy: string;
  controlledBy: string;

  eventRecord: {
    beforePlay: string;
    visited: IClearingVisitedEvent[];
  };

  landscape: {
    clearingConnections: string[];
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
    legendaryFigures: string[];
    civilWarEvents: string;
    interregnumEvents: string;
  };
}

export interface IForest {
  name: string;
  location: string;
  details: string;
  type: ForestType;
}

export interface IClearingVisitedEvent {
  timestamp: number;
  visitText: string;
  warContinuesText: string;
  warContinuesType: WarType;
}

export interface ICampaign {
  name: string;
  locked?: boolean;
  factions: string[];
  characterNames?: string[];

  clearings: IClearing[];
  forests: IForest[];
  npcs: INPC[];

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
