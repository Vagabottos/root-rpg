import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { cloneDeep, merge, pull } from 'lodash';

import { ICampaign } from '../../../interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-clearings',
  templateUrl: './campaign-view-clearings.page.html',
  styleUrls: ['./campaign-view-clearings.page.scss'],
})
export class CampaignViewClearingsPage implements OnInit {

  public isEditing: boolean;
  public campaignCopy: ICampaign;

  constructor(
    private alert: AlertController,
    private router: Router,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit(campaign: ICampaign) {
    this.isEditing = true;

    this.campaignCopy = cloneDeep(campaign);
  }

  async confirmEdit(campaign: ICampaign) {
    const alert = await this.alert.create({
      header: 'Confirm Changes',
      message: `Are you sure you want to make these clearing link changes?`,
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

            this.campaignCopy = null;
            this.data.patchCampaign().subscribe(() => {});
          }
        }
      ]
    });

    alert.present();
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
  }

}
