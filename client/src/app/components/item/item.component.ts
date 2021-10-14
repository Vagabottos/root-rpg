
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IItem } from '../../../interfaces';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemComponent implements OnInit {

  @Input() item: IItem;
  @Input() showFooter = true;
  @Input() disableWear = false;
  @Input() allowCollapse = false;
  @Input() collapse = false;
  @Output() updateWear: EventEmitter<number> = new EventEmitter();
  @Output() updateDepletion: EventEmitter<number> = new EventEmitter();
  @Output() updateLegendary: EventEmitter<number> = new EventEmitter();

  public get boxSlots(): boolean[] {
    let wear = this.item.wear;
    if (this.item.tags?.includes('Rickety')) { wear -= 1; }

    return Array(wear).fill(false);
  }

  public get depletionSlots(): boolean[] {
    let depletion = 0;
    if (this.item.tags?.includes('Stocked')) { depletion = 2; }

    return Array(depletion).fill(false);
  }

  constructor(
    public itemService: ItemService
  ) { }

  ngOnInit() {
  }

  changeWear(wear: number): void {
    if (this.disableWear) {return;}

    if (this.item.wearUsed === wear) {
      this.item.wearUsed = 0;
      this.updateWear.emit(this.item.wearUsed);
      return;
    }

    this.item.wearUsed = wear;
    this.updateWear.emit(this.item.wearUsed);
  }

  changeDepletion(depletion: number): void {
    if (this.disableWear) {return;}

    if (this.item.depletionUsed === depletion) {
      this.item.depletionUsed = 0;
      this.updateDepletion.emit(this.item.depletionUsed);
      return;
    }

    this.item.depletionUsed = depletion;
    this.updateDepletion.emit(this.item.depletionUsed);
  }

  changeLegendary(legendary: number): void {
    if (this.disableWear) {return;}

    if (this.item.legendary === legendary) {
      this.item.legendary = 0;
      this.updateLegendary.emit(this.item.legendary);
      return;
    }

    this.item.legendary = legendary;
    this.updateLegendary.emit(this.item.legendary);
  }

}
