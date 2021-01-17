
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IItem } from '../../../interfaces';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: IItem;
  @Output() updateWear: EventEmitter<number> = new EventEmitter();

  public get boxSlots(): boolean[] {
    return Array(this.item.wear).fill(false);
  }

  constructor(
    public itemService: ItemService
  ) { }

  ngOnInit() {
  }

  changeWear(wear: number): void {
    if(this.item.wearUsed === wear) {
      this.item.wearUsed = 0;
      this.updateWear.emit(this.item.wearUsed);
      return;
    }

    this.item.wearUsed = wear;
    this.updateWear.emit(this.item.wearUsed);
  }

}
