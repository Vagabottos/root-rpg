import { Injectable } from '@angular/core';

import { capitalize, cloneDeep, groupBy, sample } from 'lodash';

import { IContentConnection, IContentDrive, IContentFaction,
  IContentFeat, IContentItemTag, IContentStat, IContentMove, IContentNature,
  IContentSkill, IContentVagabond, IContent, IContentMapLayout,
  IContentFeatRisk, IContentItemPreset, IItem, IContentMoveCustomItem, content
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private content: IContent;

  constructor() {
    this.content = cloneDeep((content as any).default || content);
  }

  getAllContent(): IContent {
    return this.content;
  }

  getRandomTownName(): string {
    const { start, end } = this.content.core.clearinggen.town;

    return capitalize(sample(start) + sample(end));
  }

  getRandomForestName(): string {
    return this.getRandomTownName() + ' ' + capitalize(sample(this.content.core.clearinggen.forest));
  }

  getRandomName(): string {
    return sample(this.content.core.names);
  }

  getAllMapLayouts(): Record<string, IContentMapLayout> {
    return this.content.core.maplayouts;
  }

  getVagabonds(): string[] {
    return Object.keys(this.content.vagabonds);
  }

  getPronouns(): string[] {
    return this.content.core.pronouns;
  }

  getNames(): string[] {
    return this.content.core.names;
  }

  getStats(): string[] {
    return Object.keys(this.content.core.stats);
  }

  getStat(statName: string): IContentStat {
    return this.content.core.stats[statName];
  }

  getFeats(): string[] {
    return Object.keys(this.content.core.feats);
  }

  getRisks(): string[] {
    return Object.keys(this.content.core.featrisks);
  }

  getRisk(name: string): IContentFeatRisk {
    return this.content.core.featrisks[name];
  }

  getSpecies(): string[] {
    return this.content.core.species;
  }

  getDefaultFactions(): IContentFaction[] {
    return this.getFactions().filter(x => x.isDefault);
  }

  getFactions(): IContentFaction[] {
    return this.content.core.factions;
  }

  getVagabond(vagabond: string): IContentVagabond {
    return this.content.vagabonds[vagabond];
  }

  getTag(name: string): IContentItemTag {
    return this.content.core.itemtags[name];
  }

  getTags(tagSet: string): string[] {
    return Object.keys(this.content.core.itemtags).filter(x => this.content.core.itemtags[x].tagSet === tagSet);
  }

  getNatures(): string[] {
    return Object.keys(this.content.core.natures).sort();
  }

  getNature(name: string): IContentNature {
    return this.content.core.natures[name];
  }

  getNPCDrives(): string[] {
    return this.content.core.npcdrives.sort();
  }

  getDrives(): string[] {
    return Object.keys(this.content.core.drives).sort();
  }

  getDrive(name: string): IContentDrive {
    return this.content.core.drives[name];
  }

  getConnections(): string[] {
    return Object.keys(this.content.core.connections);
  }

  getConnection(name: string): IContentConnection {
    return this.content.core.connections[name];
  }

  getMovesByArchetype(): Record<string, Array<{ name: string; text: string }>> {
    return groupBy(this.getMoves().sort(), key => this.getMove(key).archetype);
  }

  getMoves(): string[] {
    return Object.keys(this.content.core.moves);
  }

  getMove(name: string): IContentMove {
    return this.content.core.moves[name];
  }

  getFeat(name: string): IContentFeat {
    return this.content.core.feats[name];
  }

  getBasicSkills(): string[] {
    return Object.keys(this.content.core.referencebasicmoves);
  }

  getBasicSkill(name: string): IContentSkill {
    return this.content.core.referencebasicmoves[name];
  }

  getCombatSkills(): string[] {
    return Object.keys(this.content.core.referenceskills);
  }

  getCombatSkill(name: string): IContentSkill {
    return this.content.core.referenceskills[name];
  }

  getTravelMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Travel');
  }

  getReputationMoves(): string[] {
    return Object.keys(this.content.core.referencemoves).filter(x => this.getOtherMove(x).type === 'Reputation');
  }

  getOtherMove(name: string): IContentMove {
    return this.content.core.referencemoves[name];
  }

  getSkills(): string[] {
    return Object.keys(this.content.core.skills);
  }

  getSkill(name: string): IContentSkill {
    return this.content.core.skills[name];
  }

  getItemPresets(): IContentItemPreset[] {
    return this.content.core.itempresets;
  }

  getPremadeItems(): (IItem & { type: string })[] {
    return this.content.core.premadeitems;
  }

  getCustomItemData(tag: string): IContentMoveCustomItem {
    return this.content.core.customitemdata[tag];
  }
}
