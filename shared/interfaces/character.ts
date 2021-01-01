
export enum Stat {
  Charm = 'charm',
  Cunning = 'cunning',
  Finesse = 'finesse',
  Luck = 'luck',
  Might = 'might'
}


export interface IConnection {
  name: string;
  target: string;
}

export interface IBackground {
  question: string;
  answer: string;
}

export interface ICharacter {
  name: string;
  campaign?: string;
  archetype: string;
  species: string;
  adjectives: string[];
  demeanor: string[];
  pronouns: string;
  background: IBackground[];
  drives: string[];
  nature: string;
  connections: IConnection[];
  stats: Record<Stat, number>;
  feats: string[];
  skills: string[];
  moves: string[];
  reputation: Record<string, number>;

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
