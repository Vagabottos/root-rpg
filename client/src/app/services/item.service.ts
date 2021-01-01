import { Injectable } from '@angular/core';
import { IItem } from '../../../../shared/interfaces';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private contentService: ContentService) { }

  public value(item: IItem): number {
    return item.wear
         + (item.ranges ? item.ranges.length - 1 : 0)
         + (item.skillTags?.length ?? 0)
         + ((item.tags || []).reduce((prev, cur) => prev + this.contentService.getTag(cur).valueMod, 0));
  }

  public load(item: IItem): number {
    return ((item.tags || []).reduce((prev, cur) => prev + this.contentService.getTag(cur).loadMod || 0, 0));
  }
}
