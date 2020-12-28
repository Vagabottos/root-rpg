
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ICharacter } from '../../models';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { CharacterAPIService } from '../../services/character.api.service';

enum CharacterCreateStep {
  CampaignOrNo = 'campaigncode',
  Archetype = 'archetype',
  NameSpecies = 'namespecies',
  BonusStats = 'bonusstats',
  Background = 'background',
  Natures = 'natures',
  Drives = 'drives',
  Moves = 'moves',
  Feats = 'feats',
  Skills = 'skills',
  Items = 'items',
  Connections = 'connections',
  Finalize = 'finalize'
}

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.page.html',
  styleUrls: ['./create-character.page.scss'],
})
export class CreateCharacterPage implements OnInit {

  public character: Partial<ICharacter> = {};

  public validatingCampaignId = false;
  public campaignForm = new FormGroup({
    campaignId: new FormControl('',
      [Validators.minLength(24), Validators.maxLength(24)],
      [this.validateCampaignId.bind(this)]
    )
  });

  public validationMessages = {
    campaignId: [
      { type: 'required', message: 'Campaign ID is required.' },
      { type: 'minlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'maxlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'notexists', message: 'Campaign does not exist.' }
    ]
  };

  public readonly Step = CharacterCreateStep;
  public currentStep: CharacterCreateStep = CharacterCreateStep.CampaignOrNo;

  constructor(
    private campaignAPI: CampaignAPIService,
    private characterAPI: CharacterAPIService
  ) { }

  // TODO: campaign yes/no buttons, persist character and current step to localstorage
  // TODO: leaving page should remove persisted character

  ngOnInit() {
  }

  validateCampaignId(control: AbstractControl): Observable<{ [key: string]: any } | null> {
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

  prev() {
    if (this.currentStep === CharacterCreateStep.CampaignOrNo) { return; }
  }

  next() {
    if (this.currentStep === CharacterCreateStep.Finalize) { return; }
    if (this.currentStep === CharacterCreateStep.CampaignOrNo) { this.currentStep = CharacterCreateStep.Archetype; }
  }

}
