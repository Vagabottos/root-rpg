import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-players',
  templateUrl: './campaign-view-players.page.html',
  styleUrls: ['./campaign-view-players.page.scss'],
})
export class CampaignViewPlayersPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
