import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

import { ICampaign } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-campaign-view-campaign',
  templateUrl: './campaign-view-campaign.page.html',
  styleUrls: ['./campaign-view-campaign.page.scss'],
})
export class CampaignViewCampaignPage implements OnInit {

  constructor(
    private clipboard: ClipboardService,
    private notification: NotificationService,
    private content: ContentService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addFaction(campaign: ICampaign) {

    const modal = await this.notification.loadForcedChoiceModal({
      title: `Choose Factions`,
      message: `Choose factions from the following list to add to your campaign.`,
      choices: this.content.getFactions().map(c => ({ name: c.name, text: '' })) || [],
      numChoices: 0,
      bannedChoices: [],
      disableBanned: false,
      defaultSelected: campaign.factions,
      allowCustom: true
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      campaign.factions = data.map(x => x.name);

      this.data.patchCampaign().subscribe(() => {});
    });
  }

  copyID(campaign: ICampaign) {
    this.clipboard.copy(campaign._id);
    this.notification.notify('Copied ID successfully!');
  }

  toggleLock(campaign: ICampaign) {
    campaign.locked = !campaign.locked;
    this.data.patchCampaign().subscribe(() => {});
  }

}
