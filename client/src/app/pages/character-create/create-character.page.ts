
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ICharacter } from '../../models';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { CharacterAPIService } from '../../services/character.api.service';

import * as content from '../../../../../shared/_output/content.json';

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

  public get allContent() {
    return (content as any).default || content;
  }

  public get chosenVagabond() {
    return this.vagabondData(this.archetypeForm.get('archetype').value);
  }

  public get validSpecies() {
    const vagabond = this.chosenVagabond;
    return [
      ...this.allContent.core.species,
      ...(vagabond.species || [])
    ];
  }

  public character: Partial<ICharacter> = {};

  public validatingCampaignId = false;

  public campaignForm = new FormGroup({
    campaignId: new FormControl('',
      [Validators.minLength(24), Validators.maxLength(24)],
      [this.validateCampaignId.bind(this)]
    )
  });

  public archetypeForm = new FormGroup({
    archetype: new FormControl('', [Validators.required])
  });

  public characterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    species: new FormControl('', [Validators.required]),
    pronouns: new FormControl('', [Validators.required]),
    adjectives: new FormControl([], [Validators.required]),
    demeanor: new FormControl([], [Validators.required])
  });

  public validationMessages = {
    campaignId: [
      { type: 'required', message: 'Campaign ID is required.' },
      { type: 'minlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'maxlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'notexists', message: 'Campaign does not exist.' }
    ],
    archetype: [
      { type: 'required', message: 'Archetype is required.' },
    ],
    name: [
      { type: 'required', message: 'Name is required.' },
    ],
    species: [
      { type: 'required', message: 'Species is required.' },
    ],
    pronouns: [
      { type: 'required', message: 'Pronouns are required.' },
    ],
    adjectives: [
      { type: 'required', message: 'Adjectives are required.' },
    ],
    demeanor: [
      { type: 'required', message: 'Demeanor is required.' },
    ]
  };

  public readonly Step = CharacterCreateStep;
  public currentStep: CharacterCreateStep = CharacterCreateStep.CampaignOrNo;

  constructor(
    private campaignAPI: CampaignAPIService,
    private characterAPI: CharacterAPIService
  ) { }

  ngOnInit() {
    this.load();
  }

  ionViewDidLeave() {
    this.reset();
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
    if (this.currentStep === CharacterCreateStep.CampaignOrNo)  { return; }
    if (this.currentStep === CharacterCreateStep.Archetype)     { this.currentStep = CharacterCreateStep.CampaignOrNo; }
    if (this.currentStep === CharacterCreateStep.NameSpecies)   { this.currentStep = CharacterCreateStep.Archetype; }
    if (this.currentStep === CharacterCreateStep.BonusStats)    { this.currentStep = CharacterCreateStep.NameSpecies; }
    if (this.currentStep === CharacterCreateStep.Background)    { this.currentStep = CharacterCreateStep.BonusStats; }
    if (this.currentStep === CharacterCreateStep.Natures)       { this.currentStep = CharacterCreateStep.Background; }
    if (this.currentStep === CharacterCreateStep.Drives)        { this.currentStep = CharacterCreateStep.Natures; }
    if (this.currentStep === CharacterCreateStep.Moves)         { this.currentStep = CharacterCreateStep.Drives; }
    if (this.currentStep === CharacterCreateStep.Feats)         { this.currentStep = CharacterCreateStep.Moves; }
    if (this.currentStep === CharacterCreateStep.Skills)        { this.currentStep = CharacterCreateStep.Feats; }
    if (this.currentStep === CharacterCreateStep.Items)         { this.currentStep = CharacterCreateStep.Skills; }
    if (this.currentStep === CharacterCreateStep.Connections)   { this.currentStep = CharacterCreateStep.Items; }
    if (this.currentStep === CharacterCreateStep.Finalize)      { this.currentStep = CharacterCreateStep.Connections; }

    this.save();
  }

  next() {
    if (this.currentStep === CharacterCreateStep.Finalize)      { return; }
    if (this.currentStep === CharacterCreateStep.Connections)   { this.currentStep = CharacterCreateStep.Finalize; }
    if (this.currentStep === CharacterCreateStep.Items)         { this.currentStep = CharacterCreateStep.Connections; }
    if (this.currentStep === CharacterCreateStep.Skills)        { this.currentStep = CharacterCreateStep.Items; }
    if (this.currentStep === CharacterCreateStep.Feats)         { this.currentStep = CharacterCreateStep.Skills; }
    if (this.currentStep === CharacterCreateStep.Moves)         { this.currentStep = CharacterCreateStep.Feats; }
    if (this.currentStep === CharacterCreateStep.Drives)        { this.currentStep = CharacterCreateStep.Moves; }
    if (this.currentStep === CharacterCreateStep.Natures)       { this.currentStep = CharacterCreateStep.Drives; }
    if (this.currentStep === CharacterCreateStep.Background)    { this.currentStep = CharacterCreateStep.Natures; }
    if (this.currentStep === CharacterCreateStep.BonusStats)    { this.currentStep = CharacterCreateStep.Background; }
    if (this.currentStep === CharacterCreateStep.NameSpecies)   { this.currentStep = CharacterCreateStep.BonusStats; }
    if (this.currentStep === CharacterCreateStep.Archetype)     { this.currentStep = CharacterCreateStep.NameSpecies; }
    if (this.currentStep === CharacterCreateStep.CampaignOrNo)  { this.currentStep = CharacterCreateStep.Archetype; }

    this.save();
  }

  vagabondData(vaga: string) {
    return this.allContent.vagabonds[vaga] || {};
  }

  reset() {
    this.currentStep = CharacterCreateStep.CampaignOrNo;
    this.campaignForm.reset();
    this.archetypeForm.reset();
    this.save();
  }

  load() {
    const loadObject = JSON.parse(localStorage.getItem('newchar') || '{}');
    this.currentStep = loadObject._currentStep || CharacterCreateStep.CampaignOrNo;

    loadObject.campaign = loadObject.campaign || {};
    loadObject.campaign.campaignId = loadObject.campaign.campaignId || '';

    loadObject.archetype = loadObject.archetype || {};
    loadObject.archetype.archetype = loadObject.archetype.archetype || '';

    loadObject.character = loadObject.character || {};
    loadObject.character.name = loadObject.character.name || '';
    loadObject.character.species = loadObject.character.species || '';
    loadObject.character.pronouns = loadObject.character.pronouns || '';
    loadObject.character.adjectives = loadObject.character.adjectives || [];
    loadObject.character.demeanor = loadObject.character.demeanor || [];

    this.campaignForm.setValue(loadObject.campaign || {});
    this.archetypeForm.setValue(loadObject.archetype || {});
    this.characterForm.setValue(loadObject.character || {});
  }

  save() {
    const saveObject = {
      _currentStep: this.currentStep,
      campaign: this.campaignForm.value,
      archetype: this.archetypeForm.value,
      character: this.characterForm.value
    };

    localStorage.setItem('newchar', JSON.stringify(saveObject));
  }

  confirm() {

  }

}
