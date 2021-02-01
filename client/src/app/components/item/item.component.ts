
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
  @Input() showFooter = true;
  @Output() updateWear: EventEmitter<number> = new EventEmitter();
  @Output() updateDepletion: EventEmitter<number> = new EventEmitter();

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
    if (this.item.wearUsed === wear) {
      this.item.wearUsed = 0;
      this.updateWear.emit(this.item.wearUsed);
      return;
    }

    this.item.wearUsed = wear;
    this.updateWear.emit(this.item.wearUsed);
  }

  changeDepletion(depletion: number): void {
    if (this.item.depletionUsed === depletion) {
      this.item.depletionUsed = 0;
      this.updateDepletion.emit(this.item.depletionUsed);
      return;
    }

    this.item.depletionUsed = depletion;
    this.updateDepletion.emit(this.item.depletionUsed);
  }

}
