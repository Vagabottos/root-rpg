import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICampaign } from '../../../interfaces';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.page.html',
  styleUrls: ['./view-campaign.page.scss'],
})
export class ViewCampaignPage implements OnInit {

  public campaign: ICampaign;

  constructor(
    private route: ActivatedRoute,
    private campaignAPI: CampaignAPIService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.campaignAPI.loadCampaign(id)
      .subscribe(campaign => {
        this.campaign = campaign;
        this.dataService.setActiveCampaign(campaign);
      });
  }

  ionViewDidLeave() {
    this.dataService.setActiveCampaign(null);
  }

}
