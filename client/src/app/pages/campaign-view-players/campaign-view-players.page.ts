import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { CharacterHelperService } from '../../services/character.helper.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-campaign-view-players',
  templateUrl: './campaign-view-players.page.html',
  styleUrls: ['./campaign-view-players.page.scss'],
})
export class CampaignViewPlayersPage implements OnInit {

  constructor(
    public notification: NotificationService,
    public content: ContentService,
    public data: DataService,
    public characterHelper: CharacterHelperService
  ) { }

  ngOnInit() {
  }

  getRepTotal(rep): number {
    return rep.total;
  }

}
