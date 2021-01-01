import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: IItem;

  public get value(): number {
    return this.item.wear
         + (this.item.ranges?.length ?? 0)
         + (this.item.skillTags?.length ?? 0)
         + ((this.item.tags || []).reduce((prev, cur) => prev + this.contentService.getTag(cur).valueMod, 0));
  }

  public get load(): number {
    return 0;
  }

  constructor(private contentService: ContentService) { }

  ngOnInit() {}

}
