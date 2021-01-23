import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { cloneDeep, merge } from 'lodash';

import { ICampaign, IClearing } from '../../../interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-landscape',
  templateUrl: './clearing-view-landscape.page.html',
  styleUrls: ['./clearing-view-landscape.page.scss'],
})
export class ClearingViewLandscapePage implements OnInit {

  public isEditing: boolean;
  public campaignCopy: ICampaign;
  public clearingCopy: IClearing;

  constructor(
    private router: Router,
    private alert: AlertController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit(campaign: ICampaign, clearingIdx: number) {
    this.campaignCopy = cloneDeep(campaign);
    this.clearingCopy = this.campaignCopy.clearings[clearingIdx];
    this.isEditing = !this.isEditing;
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
            merge(campaign, this.campaignCopy);

            this.isEditing = false;
            this.campaignCopy = null;
            this.clearingCopy = null;
            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  navigateTo(campaign: ICampaign, clearingId: number): void {
    this.data.setActiveCampaignClearing({ index: clearingId, clearing: campaign.clearings[clearingId] });
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearingId, 'landscape']);
  }

  addConnection(event, campaign: ICampaign, myId: number) {
    const clearingIdx = event.detail.value;
    if (!clearingIdx) { return; }

    campaign.clearings[myId].landscape.clearingConnections.push(clearingIdx);
    campaign.clearings[clearingIdx].landscape.clearingConnections.push(myId);

    event.target.value = null;
  }

  removeConnection(campaign: ICampaign, myId: number, newId: number) {
    campaign.clearings[myId].landscape.clearingConnections = campaign.clearings[myId].landscape.clearingConnections.filter(x => x !== newId);
    campaign.clearings[newId].landscape.clearingConnections = campaign.clearings[newId].landscape.clearingConnections.filter(x => x !== myId);
  }

  private save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
