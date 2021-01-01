
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
}

export interface ICharacterBackground {
  question: string;
  answer: string;
}

export interface ICharacterReputation {
  prestige: number;
  notoriety: number;
}

export interface ICharacter {
  name: string;
  campaign?: string;
  archetype: string;
  species: string;
  adjectives: string[];
  demeanor: string[];
  pronouns: string;
  background: ICharacterBackground[];
  drives: string[];
  nature: string;
  connections: ICharacterConnection[];
  stats: Record<Stat, number>;
  feats: string[];
  skills: string[];
  moves: string[];
  reputation: Record<string, ICharacterReputation>;

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
