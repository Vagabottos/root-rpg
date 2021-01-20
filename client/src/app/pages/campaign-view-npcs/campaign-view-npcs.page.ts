import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { cloneDeep } from 'lodash';

import { ICampaign, INPC } from '../../../interfaces';
import { NPCCreatorComponent } from '../../components/npc-creator/npc-creator.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-npcs',
  templateUrl: './campaign-view-npcs.page.html',
  styleUrls: ['./campaign-view-npcs.page.scss'],
})
export class CampaignViewNpcsPage implements OnInit {

  constructor(
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addNewNPC(campaign: ICampaign, npc?: INPC) {

    const modal = await this.modal.create({
      component: NPCCreatorComponent,
      componentProps: { npc: cloneDeep(npc), validFactions: campaign.factions }
    });

    modal.onDidDismiss().then((res) => {
      const resnpc = res.data;
      if (!resnpc) { return; }

      campaign.npcs = campaign.npcs || [];
      campaign.npcs.push(resnpc);

      this.data.patchCampaign().subscribe(() => {});
    });

    await modal.present();

  }

}
