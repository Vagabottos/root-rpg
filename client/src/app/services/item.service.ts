import { Injectable } from '@angular/core';

import { IItem } from '../../interfaces';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private contentService: ContentService
  ) { }

  public value(item: IItem): number {
    return item.wear
         + (item.extraValue ?? 0)
         + (item.ranges ? Math.max(item.ranges.length - 1, 0) : 0)
         + (item.skillTags?.length ?? 0)
         + ((item.tags || []).reduce((prev, cur) => prev + (this.contentService.getTag(cur)?.valueMod || 0), 0));
  }

  public load(item: IItem): number {
    return (item.extraLoad || 0)
         + ((item.tags || []).reduce((prev, cur) => prev + (this.contentService.getTag(cur)?.loadMod || 0), 0));
  }
}
