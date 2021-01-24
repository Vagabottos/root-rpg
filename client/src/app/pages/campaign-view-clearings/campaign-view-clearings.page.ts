import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICampaign } from '../../../interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-clearings',
  templateUrl: './campaign-view-clearings.page.html',
  styleUrls: ['./campaign-view-clearings.page.scss'],
})
export class CampaignViewClearingsPage implements OnInit {

  constructor(
    private router: Router,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  clickMapClearing(clearing: number, campaign: ICampaign) {
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearing]);
  }

}
