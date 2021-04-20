import { Stat } from './character';
import { IItem } from './item';

export interface IContentConnection {
  text: string;
}

export interface IContentDrive {
  text: string;
  namedTarget?: boolean;
}

export interface IContentFaction {
  name: string;
  isDefault?: boolean;
  text: string;
}

export interface IContentFeat {
  text: string;
}

export interface IContentMoveCustomItem {
  name: string;
  tagSet: string;
  extraLoad?: number;
  sections?: Array<{ name: string, numChoices: number, choices: string[] }>;
  wear?: number;
}

export interface IContentMove {
  text: string;

  // playbook moves
  archetype?: string;
  addStat?: Record<string, number>;
  addFeat?: string[];
  addHarm?: Record<string, number>;
  addSkillChoose?: number;
  addSkill?: string[];
  customItemTag?: string;

  // reputation & travel moves
  type?: string;
  requirement?: string;
}

export interface IContentNature {
  text: string;
}

export interface IContentSkill {
  text: string;
  allowItem?: string[];
  allowRange?: string[];
}

export interface IContentStat {
  text: string;
}

export interface IContentFeatRisk {
  text: string;
}

export interface IContentItemTag {
  tagSet: string;
  itemType: string[];
  text?: string;
  valueMod?: number;
  loadMod?: number;
  input?: string;
}

export interface IContentItemPreset {
  name: string;
  type: string;
  baseLoad: number;
  validRanges?: string[];
}

export interface IContentClearingGen {
  town: {
    start: string[];
    end: string[];
  }

  forest: string[];
  building: string[];
  problem: string[];
  inhabitant: string[];
}

export interface IContentMapLayout {
  maxX: number;
  maxY: number;

  corners: Array<{ origin: number, opposite: number }>;

  nodePositions: Array<{ x: number, y: number }>;
  connections: Array<{ path: string, blocks: string[] }>;
}

export interface IContentRequest {
  where: string[];
  do: Array<{ type: string, text: string }>;
  requester: string[];
  item: string[];
  group: string[];
  complication: string[];
}

export interface IContentCore {
  clearinggen: IContentClearingGen;
  customitemdata: Record<string, IContentMoveCustomItem>;
  maplayouts: Record<string, IContentMapLayout>;
  connections: Record<string, IContentConnection>;
  drives: Record<string, IContentDrive>;
  factions: IContentFaction[];
  feats: Record<string, IContentFeat>;
  featrisks: Record<string, IContentFeatRisk>;
  moves: Record<string, IContentMove>;
  names: string[];
  jobs: string[];
  natures: Record<string, IContentNature>;
  npcdrives: string[];
  portraits: string[];
  pronouns: string[];
  skills: Record<string, IContentSkill>;
  species: string[];
  premadeitems: (IItem & { type: string })[];
  itempresets: IContentItemPreset[];
  itemtags: Record<string, IContentItemTag>;
  stats: Record<string, IContentStat>;
  referencebasicmoves: Record<string, IContentMove>;
  referencemoves: Record<string, IContentMove>;
  referenceskills: Record<string, IContentSkill>;
  requests: IContentRequest;
}

export interface IContentBackgroundReputationChange {
  delta?: number;
  set?: number;
}

export interface IContentBackgroundAnswer {
  text: string;
  type?: string;
  input?: string;
  factionDelta?: number;
}

export interface IContentBackgroundQuestion {
  question: string;
  type: string;
  answers?: IContentBackgroundAnswer[];
  reputation?: IContentBackgroundReputationChange;
}

export interface IContentVagabondDrive {
  name: string;
}

export interface IContentVagabondNature {
  name: string;
}

export interface IContentVagabondConnection {
  name: string;
  text: string;
}

export interface IContentVagabondFeat {
  name: string;
}

export interface IContentVagabondSkill {
  name: string;
}

export interface IContentVagabondMove {
  name: string;
}

export interface IContentVagabond {
  archetype: string;
  description: string;
  species: string[];
  adjectives: string[];
  items: string[];
  demeanor: string[];
  background: IContentBackgroundQuestion[];
  drives: IContentVagabondDrive[];
  natures: IContentVagabondNature[];
  connections: IContentVagabondConnection[];
  stats: Record<Stat, number>;
  startingValue: number;
  chooseFeats: number;
  feats: IContentVagabondFeat[];
  numSkills: number;
  skills: IContentVagabondSkill[];
  numMoves: number;
  defaultMoves: string[];
  moves: IContentVagabondMove[];
}

export interface IContent {
  core: IContentCore;
  vagabonds: Record<string, IContentVagabond>;
}
