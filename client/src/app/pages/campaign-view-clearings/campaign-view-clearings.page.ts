import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

import { cloneDeep, pull } from 'lodash';

import { ICampaign, IClearing } from '../../../interfaces';
import { CampaignLogComponent } from '../../components/campaign-log/campaign-log.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-clearings',
  templateUrl: './campaign-view-clearings.page.html',
  styleUrls: ['./campaign-view-clearings.page.scss'],
})
export class CampaignViewClearingsPage implements OnInit {

  public showLegend: boolean;
  public isEditing: boolean;
  public campaignCopy: ICampaign;

  constructor(
    private modal: ModalController,
    private alert: AlertController,
    private router: Router,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async showTotalLog(campaign: ICampaign) {
    const modal = await this.modal.create({
      component: CampaignLogComponent,
      componentProps: {
        campaign
      }
    });

    modal.present();
  }

  toggleLegend() {
    this.showLegend = !this.showLegend;
  }

  toggleEdit(campaign: ICampaign) {
    this.isEditing = true;

    this.campaignCopy = cloneDeep(campaign);
  }

  async confirmEdit(campaign: ICampaign) {
    const alert = await this.alert.create({
      header: 'Confirm Changes',
      message: `Are you sure you want to make these changes?`,
      buttons: [
        'Cancel',
        {
          text: 'Discard changes',
          handler: () => {
            this.isEditing = false;
          }
        },
        {
          text: 'Yes, confirm',
          handler: () => {
            this.isEditing = false;
            campaign.clearings = cloneDeep(this.campaignCopy.clearings);
            campaign.forests = cloneDeep(this.campaignCopy.forests);
            campaign.lakes = cloneDeep(this.campaignCopy.lakes);

            this.campaignCopy = null;
            this.data.patchCampaign().subscribe(() => {});
          }
        }
      ]
    });

    alert.present();
  }

  getClearingNPCs(clearing: IClearing): string[] {
    return clearing.npcs.map(x => x.name);
  }

  addEdge({ source, target }) {
    const campaign = this.campaignCopy;
    const sourceId = +source.split('-')[1];
    const targetId = +target.split('-')[1];

    campaign.clearings[sourceId].landscape.clearingConnections.push(targetId);
    campaign.clearings[targetId].landscape.clearingConnections.push(sourceId);
  }

  removeEdge({ source, target }) {
    const campaign = this.campaignCopy;
    const sourceId = +source.split('-')[1];
    const targetId = +target.split('-')[1];

    pull(campaign.clearings[sourceId].landscape.clearingConnections, targetId);
    pull(campaign.clearings[targetId].landscape.clearingConnections, sourceId);
  }

  clickMapClearing(clearing: string, campaign: ICampaign) {
    const clearingId = +clearing.split('-')[1];

    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearingId]);
  }

  moveNode({ clearing, x, y }: { clearing: string; x: number; y: number }) {
    const campaign = this.campaignCopy;
    const clearingId = +clearing.split('-')[1];

    campaign.clearings[clearingId].position = { x, y };
  }

  addForest({ forest }) {
    const campaign = this.campaignCopy;
    const forestId = +forest.id.split('-')[1];

    campaign.forests[forestId] = {
      name: forest.title,
      details: '',
      location: '???',
      type: 'mystery',
      position: { x: forest.x, y: forest.y }
    };

  }

  moveForest({ forest, x, y }: { forest: string; x: number; y: number }) {
    const campaign = this.campaignCopy;
    const forestId = +forest.split('-')[1];

    campaign.forests[forestId].position = { x, y };
  }

  addLake({ lake }) {
    const campaign = this.campaignCopy;
    const lakeId = +lake.id.split('-')[1];

    campaign.lakes = campaign.lakes || [];
    campaign.lakes[lakeId] = {
      position: { x: lake.x, y: lake.y },
      connectedLakes: []
    };

  }

  moveLake({ lake, x, y }: { lake: string; x: number; y: number }) {
    const campaign = this.campaignCopy;
    const lakeId = +lake.split('-')[1];

    campaign.lakes[lakeId].position = { x, y };

    console.log(lakeId, x, y);
  }

  addLakeEdge({ source, target }) {
    const campaign = this.campaignCopy;
    const sourceId = +source.split('-')[1];
    const targetId = +target.split('-')[1];

    campaign.lakes[sourceId].connectedLakes.push(targetId);
    campaign.lakes[targetId].connectedLakes.push(sourceId);
  }

  removeLakeEdge({ source, target }) {
    const campaign = this.campaignCopy;
    const sourceId = +source.split('-')[1];
    const targetId = +target.split('-')[1];

    pull(campaign.lakes[sourceId].connectedLakes, targetId);
    pull(campaign.lakes[targetId].connectedLakes, sourceId);
  }

}
