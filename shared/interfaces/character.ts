import { IItem } from './item';

export enum Stat {
  Charm = 'charm',
  Cunning = 'cunning',
  Finesse = 'finesse',
  Luck = 'luck',
  Might = 'might'
}


export interface ICharacterConnection {
  name: string;
  target: string;
  text: string;
}

export interface ICharacterBackground {
  question: string;
  answer: string;
}

export interface ICharacterReputation {
  prestige: number;
  notoriety: number;
  total: number;
}

export interface ICharacter {
  name: string;
  campaign?: string;
  campaignName?: string;
  archetype: string;
  species: string;
  portrait: string;
  adjectives: string[];
  keepsakes: string[];
  demeanor: string[];
  pronouns: string;
  background: ICharacterBackground[];
  drives: string[];
  driveTargets: Record<string, string>;
  nature: string;
  connections: ICharacterConnection[];
  stats: Record<Stat, number>;
  feats: string[];
  skills: string[];
  moveSkills: string[];
  moves: string[];
  items: IItem[];
  reputation: Record<string, ICharacterReputation>;
  notes: string;

  harm: {
    injury: number;
    exhaustion: number;
    depletion: number;
    diplomat: number;
    legacy: number;
  };

  harmBoost: {
    injury: number;
    exhaustion: number;
    depletion: number;
  }

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
