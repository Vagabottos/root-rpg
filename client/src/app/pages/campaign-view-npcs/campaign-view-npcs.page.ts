import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';

import { cloneDeep } from 'lodash';

import { ICampaign, INPC } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { NPCCreatorComponent } from '../../components/npc-creator/npc-creator.component';
import { NPCRandomizerComponent } from '../../components/npc-randomizer/npc-randomizer.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-npcs',
  templateUrl: './campaign-view-npcs.page.html',
  styleUrls: ['./campaign-view-npcs.page.scss'],
})
export class CampaignViewNpcsPage implements OnInit {

  constructor(
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private popover: PopoverController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addNewNPC(campaign: ICampaign, npc?: INPC) {

    const modal = await this.modal.create({
      component: NPCCreatorComponent,
      componentProps: { npc: cloneDeep(npc), validFactions: campaign.factions },
      cssClass: 'big-modal'
    });

    modal.onDidDismiss().then((res) => {
      const resnpc = res.data;
      if (!resnpc) { return; }

      campaign.npcs = campaign.npcs || [];
      const prevIndex = campaign.npcs.findIndex(n => n === npc);

      if (prevIndex === -1) {
        campaign.npcs.push(resnpc);
      } else {
        campaign.npcs[prevIndex] = resnpc;
      }

      this.save();
    });

    await modal.present();

  }

  async showDeleteActionSheet(camp: ICampaign, npc: INPC) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.addNewNPC(camp, npc);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptDeleteNPC(camp, npc);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showDeletePopover(event, camp: ICampaign, npc: INPC) {
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
        this.addNewNPC(camp, npc);
      }

      if (resAct === 'delete') {
        this.attemptDeleteNPC(camp, npc);
      }
    });

    popover.present();
  }

  async attemptDeleteNPC(campaign: ICampaign, npc: INPC) {
    const alert = await this.alert.create({
      header: 'Delete NPC',
      message: `Are you sure you want to delete the NPC ${npc.name}? This is permanent and not reversible!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            campaign.npcs = campaign.npcs.filter(x => x !== npc);

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

  public save() {
    this.data.patchCampaign().subscribe(() => {});
  }

  async openNPCRandomizer(campaign: ICampaign) {

    const modal = await this.modal.create({
      component: NPCRandomizerComponent,
      componentProps: { validFactions: campaign.factions, maxNPCs: 15 - campaign.npcs.length },
      cssClass: 'big-modal'
    });

    modal.onDidDismiss().then((res) => {
      const resnpcs = res.data;
      if (!resnpcs) { return; }

      campaign.npcs = campaign.npcs || [];

      campaign.npcs.push(...resnpcs);

      this.save();
    });

    await modal.present();
  }

}
