import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { INPC } from '../../../../../shared/interfaces';
import { IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-npc-creator',
  templateUrl: './npc-creator.component.html',
  styleUrls: ['./npc-creator.component.scss'],
})
export class NPCCreatorComponent implements OnInit {

  @Input() npc: INPC;

  public npcForm = new FormGroup({
    name:         new FormControl('', [Validators.required])
  });

  public get formNPC(): INPC {
    return {
      name: this.npcForm.get('name').value,
      look: '',
      faction: '',
      drive: '',
      equipment: [],
      notes: '',
      harm: {
        depletion: 0,
        exhaustion: 0,
        injury: 0,
        morale: 0
      }
    };
  }

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    public contentService: ContentService,
    public itemService: ItemService
  ) { }

  ngOnInit() {
    if (this.npc) {
      this.npcForm.get('name').setValue(this.npc.name);
    }
  }

  dismiss(npc?: INPC) {
    this.modal.dismiss(npc);
  }

}
