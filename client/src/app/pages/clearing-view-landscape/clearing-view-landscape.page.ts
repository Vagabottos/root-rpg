import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICampaign } from '../../../../../shared/interfaces';
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
    private route: ActivatedRoute,
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

}
