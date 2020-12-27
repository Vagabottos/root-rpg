import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICampaign } from '../../models';
import { CampaignAPIService } from '../../services/campaign.api.service';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.page.html',
  styleUrls: ['./view-campaign.page.scss'],
})
export class ViewCampaignPage implements OnInit {

  public campaign: ICampaign;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignAPI: CampaignAPIService
  ) { }

  ngOnInit() {

    // TODO: make CampaignExists guard
    const id = this.route.snapshot.paramMap.get('id');

    const kickback = () => {
      this.router.navigate(['/dashboard']);
    };

    if (!id) {
      kickback();
      return;
    }

    this.campaignAPI.loadCampaign(id)
      .subscribe(campaign => {
        this.campaign = campaign;
      }, () => {
        kickback();
      });
  }

}
