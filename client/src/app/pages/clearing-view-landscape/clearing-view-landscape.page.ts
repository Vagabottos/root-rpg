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
      this.data.patchCampaign().subscribe(() => {});
    }
  }

  navigateTo(campaign: ICampaign, clearingId: number): void {
    this.data.setActiveCampaignClearing({ index: clearingId, clearing: campaign.clearings[clearingId] });
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearingId, 'landscape']);
  }

  addConnection(event, clearing: IClearing) {
    const clearingIdx = event.detail.value;
    if(!clearingIdx) return;

    clearing.landscape.clearingConnections.push(clearingIdx);

    event.target.value = null;

    this.save();
  }

  removeConnection(clearing: IClearing, clearingIdx: number) {
    clearing.landscape.clearingConnections = clearing.landscape.clearingConnections.filter(x => x !== clearingIdx);

    this.save();
  }

  private save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
