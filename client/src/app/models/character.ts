
export interface ICharacter {
  name: string;
  campaign?: string;
  archetype: string;
  species: string;
  gender: string;
  background: string[];
  drives: string[];
  natures: string[];
  connections: string[];
  stats: Record<string, number>;
  feats: string[];
  skills: string[];
  moves: string[];

  createdAt?: number;
  updatedAt?: number;
  _id?: string;
  owner?: string;
}
