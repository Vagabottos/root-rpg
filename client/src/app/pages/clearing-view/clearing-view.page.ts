import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view',
  templateUrl: './clearing-view.page.html',
  styleUrls: ['./clearing-view.page.scss'],
})
export class ClearingViewPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private campaignAPI: CampaignAPIService,
    private data: DataService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const clearing = this.route.snapshot.paramMap.get('clearing');

    this.campaignAPI.loadCampaign(id)
      .subscribe(campaign => {
        this.data.setActiveCampaignClearing({ index: +clearing, clearing: campaign.clearings[+clearing] });
        this.data.setActiveCampaign(campaign);
      });
  }

}
