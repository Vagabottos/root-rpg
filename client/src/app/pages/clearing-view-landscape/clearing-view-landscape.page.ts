import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICampaign, IClearing } from '../../../../../shared/interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-landscape',
  templateUrl: './clearing-view-landscape.page.html',
  styleUrls: ['./clearing-view-landscape.page.scss'],
})
export class ClearingViewLandscapePage implements OnInit {

  public isEditing: boolean;

  constructor(
    private router: Router,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.save();
    }
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
