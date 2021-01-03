import { Component, OnInit } from '@angular/core';
import { ICampaign } from '../../../interfaces';
import { CampaignAPIService } from '../../services/campaign.api.service';

@Component({
  selector: 'app-dashboard-campaigns',
  templateUrl: './dashboard-campaigns.page.html',
  styleUrls: ['./dashboard-campaigns.page.scss'],
})
export class DashboardCampaignsPage implements OnInit {

  public campaigns: ICampaign[];

  private page = 0;

  constructor(private campaignAPI: CampaignAPIService) { }

  ngOnInit() {
    this.loadCampaigns(0);
  }

  loadCampaigns(page = 0, $event = null): void {
    this.campaignAPI.getCampaigns(page)
      .subscribe(campaigns => {
        if ($event) {
          this.campaigns.push(...campaigns.data);

          if (this.campaigns.length >= campaigns.total) {
            $event.target.disabled = true;
          }

          $event.target.complete();
          return;
        }

        this.campaigns = campaigns.data || [];
      });
  }

  loadMoreCampaigns($event) {
    this.page += 1;
    this.loadCampaigns(this.page, $event);
  }

}
