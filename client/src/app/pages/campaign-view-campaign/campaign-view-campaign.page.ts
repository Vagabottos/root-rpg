import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-campaign',
  templateUrl: './campaign-view-campaign.page.html',
  styleUrls: ['./campaign-view-campaign.page.scss'],
})
export class CampaignViewCampaignPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
