import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { INPC, IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { ItemCreatorService } from '../../services/item-creator.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-npc-creator',
  templateUrl: './npc-creator.component.html',
  styleUrls: ['./npc-creator.component.scss'],
})
export class NPCCreatorComponent implements OnInit {

  @Input() npc: INPC;
  @Input() validFactions: string[] = [];

  public npcForm = new FormGroup({
    name:         new FormControl('', [Validators.required, Validators.maxLength(25)]),
    look:         new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    faction:      new FormControl('', [Validators.required, Validators.maxLength(25)]),
    drive:        new FormControl('', [Validators.required, Validators.maxLength(25)]),
    notes:        new FormControl('', [Validators.maxLength(1000)]),
    equipment:    new FormControl([]),
  });

  public get formNPC(): INPC {
    return {
      name: this.npcForm.get('name').value,
      look: this.npcForm.get('look').value,
      faction: this.npcForm.get('faction').value,
      drive: this.npcForm.get('drive').value,
      equipment: this.npcForm.get('equipment').value,
      notes: this.npcForm.get('notes').value,
      harm: {
        depletion: 0,
        exhaustion: 0,
        injury: 0,
        morale: 0
      }
    };
  }

  constructor(
    private modal: ModalController,
    public contentService: ContentService,
    private itemCreator: ItemCreatorService,
    public itemService: ItemService
  ) { }

  pickRandomName() {
    this.npcForm.get('name').setValue(this.contentService.getRandomName());
  }

  ngOnInit() {
    if (this.npc) {
      this.npcForm.get('name').setValue(this.npc.name);
      this.npcForm.get('look').setValue(this.npc.look);
      this.npcForm.get('faction').setValue(this.npc.faction);
      this.npcForm.get('drive').setValue(this.npc.drive);
      this.npcForm.get('equipment').setValue(this.npc.equipment);
      this.npcForm.get('notes').setValue(this.npc.notes);
    }
  }

  dismiss(npc?: INPC) {
    this.modal.dismiss(npc);
  }

  async addItem() {
    const modal = await this.itemCreator.createItem();

    modal.onDidDismiss().then((res) => {
      const resItem = res.data;
      if (!resItem) { return; }

      this.npcForm.get('equipment').value.push(resItem);
    });

    await modal.present();
  }

  removeItem(item: IItem) {
    const control = this.npcForm.get('equipment');
    control.setValue(control.value.filter(x => x !== item));
  }

}
