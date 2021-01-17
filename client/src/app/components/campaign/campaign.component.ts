import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ICampaign, ICharacter } from '../../../../../shared/interfaces';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit, OnDestroy {

  public character$: Subscription;
  public character: ICharacter;
  public campaignCharacters: ICharacter[];
  public campaign: ICampaign;

  public joinCampaignId: string;
  public joinCampaignError: boolean;

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    private notify: NotificationService,
    private campaignAPI: CampaignAPIService,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.character$ = this.data.char$.subscribe(c => {
      this.character = c;

      if (c.campaign) {
        this.loadCampaign();
      }
    });
  }

  ngOnDestroy() {
    this.character$?.unsubscribe();
  }

  dismiss() {
    this.modal.dismiss();
  }

  loadCampaign() {
    if (!this.character.campaign) { return; }

    this.campaignAPI.loadCampaign(this.character.campaign)
      .subscribe(campaign => {
        this.campaign = campaign;

        this.campaignAPI.getCampaignCharacters(this.character.campaign)
          .subscribe(chars => {
            this.campaignCharacters = chars.data;
          });
      });
  }

  tryJoinCampaign(character: ICharacter) {
    character.campaign = this.joinCampaignId;

    this.data.patchCharacter().subscribe(
      () => {
        this.joinCampaignId = '';
        this.notify.notify('Successfully joined campaign!');

        this.loadCampaign();
      },
      () => {
        character.campaign = '';
        this.joinCampaignError = true;
      }
    );
  }

  async leaveCampaign(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Leave Campaign',
      message: `Are you sure you want to leave your campaign?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, leave campaign',
          handler: () => {
            character.campaign = '';

            this.data.patchCharacter().subscribe(() => {});
          }
        }
      ]
    });

    alert.present();
  }

}
