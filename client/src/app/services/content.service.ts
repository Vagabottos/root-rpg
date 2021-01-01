import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';
import { IContentFaction, IContentItemTag, IContentVagabond } from '../../../../shared/interfaces';

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
}
