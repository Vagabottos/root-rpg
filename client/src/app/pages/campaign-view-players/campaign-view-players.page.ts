import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { CharacterHelperService } from '../../services/character.helper.service';
import { NotificationService } from '../../services/notification.service';
import { ICharacter, ICampaign } from '../../../interfaces';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';
import { GMPlayerPopoverComponent } from '../../components/gmplayer.popover';
import { CampaignAPIService } from '../../services/campaign.api.service';

@Component({
  selector: 'app-campaign-view-players',
  templateUrl: './campaign-view-players.page.html',
  styleUrls: ['./campaign-view-players.page.scss'],
})
export class CampaignViewPlayersPage implements OnInit {

  constructor(
    private actionSheet: ActionSheetController,
    private popover: PopoverController,
    private alert: AlertController,
    public notification: NotificationService,
    public content: ContentService,
    public data: DataService,
    public characterHelper: CharacterHelperService,
    private campaignAPI: CampaignAPIService
  ) { }

  ngOnInit() {
  }

  getRepTotal(rep): number {
    return rep.total;
  }

  async showActionActionSheet(campaign: ICampaign, character: ICharacter) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Kick',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptKickPlayer(campaign, character);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showActionPopover(campaign: ICampaign, character: ICharacter, event) {
    const popover = await this.popover.create({
      component: GMPlayerPopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'kick') {
        this.attemptKickPlayer(campaign, character);
      }
    });

    popover.present();
  }

  async attemptKickPlayer(campaign: ICampaign, character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Kick Player',
      message: `Are you sure you want to kick this player? They can rejoin if they still have your ID and your campaign is unlocked.`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, kick',
          handler: () => {
            this.campaignAPI.patchCampaign(campaign._id, { kickPlayer: character._id } as any)
              .subscribe(() => {
                this.data.refreshCampaignPlayers(campaign._id);
              });
          }
        }
      ]
    });

    alert.present();
  }

}
