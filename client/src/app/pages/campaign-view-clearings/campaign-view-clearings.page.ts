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
    campaign.clearings[source].landscape.clearingConnections.push(target);
    campaign.clearings[target].landscape.clearingConnections.push(source);
  }

  removeEdge({ source, target }) {
    const campaign = this.campaignCopy;
    pull(campaign.clearings[source].landscape.clearingConnections, target);
    pull(campaign.clearings[target].landscape.clearingConnections, source);
  }

  clickMapClearing(clearing: number, campaign: ICampaign) {
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearing]);
  }

  moveNode({ clearing, x, y }: { clearing: number; x: number; y: number }) {
    const campaign = this.campaignCopy;
    campaign.clearings[clearing].position = { x, y };

    console.log(x, y);
  }

  addForest({ forest }) {
    const campaign = this.campaignCopy;
    const forestId = forest.id - campaign.clearings.length - 1;

    campaign.forests[forestId] = {
      name: forest.title,
      details: '',
      location: '???',
      type: 'mystery',
      position: { x: forest.x, y: forest.y }
    };

  }

  moveForest({ forest, x, y }: { forest: number; x: number; y: number }) {
    const campaign = this.campaignCopy;
    const forestId = forest - campaign.clearings.length - 1;

    campaign.forests[forestId].position = { x, y };
  }

}
