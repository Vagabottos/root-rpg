import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, PopoverController } from '@ionic/angular';
import { clamp, cloneDeep } from 'lodash';

import { ICharacter, IItem, Stat } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { ItemCreatorComponent } from '../../components/item-creator/item-creator.component';
import { DataService } from '../../services/data.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-character-view-inventory',
  templateUrl: './character-view-inventory.page.html',
  styleUrls: ['./character-view-inventory.page.scss'],
})
export class CharacterViewInventoryPage implements OnInit {

  constructor(
    private popover: PopoverController,
    private actionSheet: ActionSheetController,
    private modal: ModalController,
    private itemService: ItemService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  carrying(char: ICharacter): number {
    return char.items.reduce((prev, cur) => prev + this.itemService.load(cur), 0);
  }

  burdened(char: ICharacter): number {
    return 4 + char.stats[Stat.Might];
  }

  max(char: ICharacter): number {
    return this.burdened(char) * 2;
  }

  wear(item: IItem, delta: number): void {
    item.wearUsed = item.wearUsed || 0;
    item.wearUsed += delta;

    item.wearUsed = clamp(item.wearUsed, 0, item.wear);

    this.save();
  }

  async itemOptions(char: ICharacter, item: IItem, index: number): Promise<void> {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeItem(char, item, index);
          }
        },
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.editItem(char, item, index);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async addNewItem(char: ICharacter, item?: IItem, index?: number) {
    const modal = await this.modal.create({
      component: ItemCreatorComponent,
      componentProps: { item: cloneDeep(item), postProcess: true }
    });

    modal.onDidDismiss().then((res) => {
      const resItem = res.data;
      if (!resItem) { return; }

      if (item) {
        char.items[index] = resItem;

      } else {
        char.items.push(resItem);
      }

      this.save();
    });

    await modal.present();
  }

  async showItemEditPopover(character: ICharacter, item: IItem, index: number, event) {
    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'edit') {
        this.editItem(character, item, index);
      }

      if (resAct === 'delete') {
        this.removeItem(character, item, index);
      }
    });

    popover.present();
  }

  public editItem(character: ICharacter, item: IItem, index: number) {
    this.addNewItem(character, item, index);
  }

  public removeItem(character: ICharacter, item: IItem, index: number) {
    character.items.splice(index, 1);

    this.save();
  }

  public save() {
    this.data.patchCharacter().subscribe(() => {});
  }

}
