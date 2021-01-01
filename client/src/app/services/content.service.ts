import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';
import { IContentDrive, IContentFaction, IContentFeat, IContentItemTag, IContentMove, IContentNature, IContentSkill, IContentVagabond } from '../../../../shared/interfaces';

import { IContent, content } from '../../interfaces';

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

  getNature(name: string): IContentNature {
    return this.content.core.natures[name];
  }

  getDrive(name: string): IContentDrive {
    return this.content.core.drives[name];
  }

  getConnection(name: string): IContentConnection {
    return this.content.core.connections[name];
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
