
import { Component, Input, OnInit } from '@angular/core';
import { IItem } from '../../../interfaces';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: IItem;

  public get boxSlots(): boolean[] {
    return Array(this.item.wear).fill(false);
  }

  constructor(
    public itemService: ItemService
  ) { }

  ngOnInit() {
  }

}
