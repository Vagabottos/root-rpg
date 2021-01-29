import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { cloneDeep, random, sample, sampleSize } from 'lodash';
import { ItemRange } from '../../../../shared/interfaces';

import { IItem } from '../../interfaces';
import { ItemCreatorComponent } from '../components/item-creator/item-creator.component';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ItemCreatorService {

  constructor(
    private modal: ModalController,
    private content: ContentService
  ) { }

  async createItem(item?: IItem, itemData?: any) {
    const modal = await this.modal.create({
      component: ItemCreatorComponent,
      componentProps: { item: cloneDeep(item), customItemData: cloneDeep(itemData) }
    });

    return modal;
  }

  private createItemRaw(itemType: string, factions: string[]): IItem {
    if (random(1, 10) === 1) { return cloneDeep(sample(this.content.getPremadeItems().filter(x => (x as any).type === itemType))); }

    const preset = sample(this.content.getItemPresets().filter(x => x.type === itemType));

    const baseItem: IItem = {
      name: preset.name,
      wear: sample([0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4]),
      extraLoad: preset.baseLoad,
      tags: sampleSize(
        this.content.getTags('default').filter(x => this.content.getTag(x).itemType.includes(itemType)),
        sample([1, 1, 1, 1, 2, 2, 3])
      ),
    };

    if (baseItem.tags.includes('Luxurious')) {
      baseItem.extraValue = 3;
    }

    if (baseItem.tags.includes('Ceremonial')) {
      baseItem.designation = sample(factions);
    }

    if (['Weapon', 'Bow'].includes(itemType)) {
      baseItem.ranges = sampleSize(preset.validRanges || ['intimate', 'close', 'far'], sample([1, 1, 1, 2, 2, 3]));

      const validSkills = this.content.getSkills()
        .filter(s => this.content.getSkill(s).allowItem?.includes(itemType)
                  && this.content.getSkill(s).allowRange?.some(r => baseItem.ranges.includes(r as ItemRange)));

      baseItem.skillTags = sampleSize(validSkills, sample([0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3]));
    }

    return cloneDeep(baseItem);
  }

  createRandomBow({ validFactions }) {
    return this.createItemRaw('Bow', validFactions);
  }

  createRandomWeapon({ validFactions }) {
    return this.createItemRaw('Weapon', validFactions);
  }

  createRandomShield({ validFactions }) {
    return this.createItemRaw('Shield', validFactions);
  }

  createRandomArmor({ validFactions }) {
    return this.createItemRaw('Armor', validFactions);
  }
}
