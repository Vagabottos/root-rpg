import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-npcs',
  templateUrl: './campaign-view-npcs.page.html',
  styleUrls: ['./campaign-view-npcs.page.scss'],
})
export class CampaignViewNpcsPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
