import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { cloneDeep } from 'lodash';

import { IItem } from '../../interfaces';
import { ItemCreatorComponent } from '../components/item-creator/item-creator.component';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  constructor(
    private modal: ModalController
  ) { }

  async createItem(item?: IItem, itemData?: any) {
    const modal = await this.modal.create({
      component: ItemCreatorComponent,
      componentProps: { item: cloneDeep(item), customItemData: cloneDeep(itemData) }
    });

    return modal;
  }
}
