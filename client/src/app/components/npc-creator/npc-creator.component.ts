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
    name:         new FormControl('', [Validators.required, Validators.maxLength(50)]),
    look:         new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    faction:      new FormControl('', [Validators.required, Validators.maxLength(50)]),
    drive:        new FormControl('', [Validators.required, Validators.maxLength(50)]),
    notes:        new FormControl('', [Validators.maxLength(1000)]),
    injury:       new FormControl(1,  [Validators.required, Validators.min(0), Validators.max(5)]),
    depletion:    new FormControl(1,  [Validators.required, Validators.min(0), Validators.max(5)]),
    exhaustion:   new FormControl(1,  [Validators.required, Validators.min(0), Validators.max(5)]),
    morale:       new FormControl(1,  [Validators.required, Validators.min(0), Validators.max(5)]),
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
      harmMax: {
        depletion: this.npcForm.get('depletion').value,
        exhaustion: this.npcForm.get('exhaustion').value,
        injury: this.npcForm.get('injury').value,
        morale: this.npcForm.get('morale').value
      },
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
      this.npcForm.get('injury').setValue(this.npc.harmMax?.injury ?? 1);
      this.npcForm.get('depletion').setValue(this.npc.harmMax?.depletion ?? 1);
      this.npcForm.get('exhaustion').setValue(this.npc.harmMax?.exhaustion ?? 1);
      this.npcForm.get('morale').setValue(this.npc.harmMax?.morale ?? 1);
    }
  }

  dismiss(npc?: INPC) {
    this.modal.dismiss(npc);
  }

  public boxSlots(harm: string): boolean[] {
    return Array(this.npcForm.get(harm).value).fill(false);
  }

  adjustHarm(harm: string, mod: number): void {
    const control = this.npcForm.get(harm);
    control.setValue(control.value + mod);
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
