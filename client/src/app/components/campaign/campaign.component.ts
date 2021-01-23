import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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

  public joinCampaign: ICampaign;
  public validatingCampaignId = false;

  public campaignForm = new FormGroup({
    campaignId: new FormControl('',
      [Validators.minLength(24), Validators.maxLength(24)],
      [this.validateCampaignId.bind(this)]
    )
  });

  public validationMessages = {
    campaignId: [
      { type: 'required',  message: 'Campaign ID is required.' },
      { type: 'minlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'maxlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'notexists', message: 'Campaign does not exist.' },
      { type: 'locked',    message: 'Campaign is locked and cannot be joined.' }
    ]
  };

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

  validateCampaignId(control: AbstractControl): Observable<{ [key: string]: any } | null> {
    this.joinCampaign = null;

    if (control.value === null || control.value.length !== 24) {
      return of(null);
    }

    this.validatingCampaignId = true;

    return timer(1000)
      .pipe(
        switchMap(() => {
          return this.campaignAPI.loadCampaign(control.value).pipe(
            tap(() => this.validatingCampaignId = false),

            map(res => {
              if (res) {
                if (res.locked) {
                  return { locked: true };
                }

                this.joinCampaign = res;
                return null;
              }

              return { notexists: true };
            }),

            catchError(() => {
              return of({ notexists: true });
            })
          );
        })
      );
  }

  loadCampaign() {
    if (!this.character.campaign) { return; }

    this.campaignAPI.loadCampaign(this.character.campaign)
      .subscribe(campaign => {
        this.campaign = campaign;

        this.character.reputation = {};
        campaign.factions.forEach(fact => {
          this.character.reputation[fact] = { notoriety: 0, prestige: 0, total: 0 };
        });

        this.data.patchCharacter().subscribe(() => {});

        this.campaignAPI.getCampaignCharacters(this.character.campaign)
          .subscribe(chars => {
            this.campaignCharacters = chars.data;
          });

      }, () => {
        this.character.campaign = '';
        this.data.patchCharacter().subscribe(() => {});
      });
  }

  tryJoinCampaign(character: ICharacter) {
    character.campaign = this.campaignForm.get('campaignId').value;

    this.data.patchCharacter().subscribe(
      () => {
        this.campaignForm.get('campaignId').setValue('');
        this.notify.notify('Successfully joined campaign! Double check your reputation and make sure all the marks are there.');

        this.loadCampaign();
      },
      () => {
        character.campaign = '';
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
            this.campaign = null;
            this.campaignCharacters = [];
            character.campaign = '';

            this.data.patchCharacter().subscribe(() => {});
          }
        }
      ]
    });

    alert.present();
  }

}
