import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';

import { cloneDeep } from 'lodash';

import { ICampaign, INPC, IClearing } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { NPCCreatorComponent } from '../../components/npc-creator/npc-creator.component';
import { NPCRandomizerComponent } from '../../components/npc-randomizer/npc-randomizer.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-npcs',
  templateUrl: './clearing-view-npcs.page.html',
  styleUrls: ['./clearing-view-npcs.page.scss'],
})
export class ClearingViewNpcsPage implements OnInit {

  constructor(
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private popover: PopoverController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addNewNPC(campaign: ICampaign, clearing: IClearing, npc?: INPC) {

    const modal = await this.modal.create({
      component: NPCCreatorComponent,
      componentProps: { npc: cloneDeep(npc), validFactions: campaign.factions },
      cssClass: 'big-modal'
    });

    modal.onDidDismiss().then((res) => {
      const resnpc = res.data;
      if (!resnpc) { return; }

      clearing.npcs = clearing.npcs || [];
      const prevIndex = clearing.npcs.findIndex(n => n === npc);

      if (prevIndex === -1) {
        clearing.npcs.push(resnpc);
      } else {
        clearing.npcs[prevIndex] = resnpc;
      }

      this.save();
    });

    await modal.present();

  }

  async showDeleteActionSheet(campaign: ICampaign, clearing: IClearing, npc: INPC) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.addNewNPC(campaign, clearing, npc);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptDeleteNPC(clearing, npc);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showDeletePopover(event, campaign: ICampaign, clearing: IClearing, npc: INPC) {
    event.stopPropagation();
    event.preventDefault();

    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'edit') {
        this.addNewNPC(campaign, clearing, npc);
      }

      if (resAct === 'delete') {
        this.attemptDeleteNPC(clearing, npc);
      }
    });

    popover.present();
  }

  async attemptDeleteNPC(clearing: IClearing, npc: INPC) {
    const alert = await this.alert.create({
      header: 'Delete NPC',
      message: `Are you sure you want to delete the NPC ${npc.name}? This is permanent and not reversible!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            clearing.npcs = clearing.npcs.filter(x => x !== npc);

            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  adjustHarm(npc: INPC, harm: string, newValue: number): void {
    if (!npc.harm) { npc.harm = { injury: 0, depletion: 0, exhaustion: 0, morale: 0 }; }

    if (npc.harm[harm.toLowerCase()] === newValue) {
      npc.harm[harm.toLowerCase()] = 0;
      this.save();
      return;
    }

    npc.harm[harm.toLowerCase()] = newValue;
    this.save();
  }

  maxHarmBoxes(): number[] {
    return [0, 1, 2, 3, 4, 5];
  }

  harmBoxes(npc: INPC, harm: string): number[] {
    return Array(npc.harmMax?.[harm.toLowerCase()] ?? 1).fill(false).map((x, i) => i);
  }

  async openNPCRandomizer(campaign: ICampaign, clearing: IClearing) {

    const modal = await this.modal.create({
      component: NPCRandomizerComponent,
      componentProps: { validFactions: campaign.factions, maxNPCs: 15 - clearing.npcs.length },
      cssClass: 'big-modal'
    });

    modal.onDidDismiss().then((res) => {
      const resnpcs = res.data;
      if (!resnpcs) { return; }

      clearing.npcs = clearing.npcs || [];

      clearing.npcs.push(...resnpcs);

      this.save();
    });

    await modal.present();
  }

  public save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
