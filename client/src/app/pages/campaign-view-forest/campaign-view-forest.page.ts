import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-forest',
  templateUrl: './campaign-view-forest.page.html',
  styleUrls: ['./campaign-view-forest.page.scss'],
})
export class CampaignViewForestPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
