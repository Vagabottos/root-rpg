
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
  natures: string[];
  connections: IConnection[];
  stats: Record<string, number>;
  feats: string[];
  skills: string[];
  moves: string[];

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
