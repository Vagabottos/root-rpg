import { Injectable } from '@angular/core';

import { cloneDeep, groupBy } from 'lodash';

import { IContentConnection, IContentDrive, IContentFaction,
  IContentFeat, IContentItemTag, IContentStat, IContentMove, IContentNature,
  IContentSkill, IContentVagabond, IContent, content
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

  getSpecies(): string[] {
    return this.content.core.species;
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

  getWeaponSkills(): string[] {
    return Object.keys(this.content.core.skills);
  }

  getNature(name: string): IContentNature {
    return this.content.core.natures[name];
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

  getMovesByArchetype(): Record<string, Array<{ name: string, text: string }>> {
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

  getSkill(name: string): IContentSkill {
    return this.content.core.skills[name];
  }
}
