
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { capitalize, cloneDeep, sample } from 'lodash';

import { CampaignAPIService } from '../../services/campaign.api.service';
import { CharacterAPIService } from '../../services/character.api.service';

import { content } from '../../../interfaces';

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

  public allContent;

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

  public get validFactions() {
    return [
      ...this.allContent.core.factions
    ];
  }

  public readonly stats = [
    { name: 'Charm',    key: 'charm',   desc: 'Charm measures how socially adept you are, how capable you are of bending other people to your will using words and ideas.' },
    { name: 'Cunning',  key: 'cunning', desc: 'Cunning measures how sharp-minded you are, how capable you are of noticing important details in people and places, and how capable you are of tricking others.' },
    { name: 'Finesse',  key: 'finesse', desc: 'Finesse measures how deft and dexterous you are, how capable you are of performing complicated or intricate tasks with your hands.' },
    { name: 'Luck',     key: 'luck',    desc: 'Luck measures how...well...lucky you are, how capable you are of putting your fate into the hands of pure chance and coming out on top.' },
    { name: 'Might',    key: 'might',   desc: 'Might measures how strong and tough you are, how capable you are of overpowering opponents or succeeding in tasks that require brute force.' }
  ];

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

  public bonusForm = new FormGroup({
    stat: new FormControl('', [Validators.required])
  });

  public backgroundForm = new FormGroup({
    backgrounds: new FormArray([])
  });

  public naturesForm = new FormGroup({
    nature: new FormControl('', [Validators.required])
  });

  public drivesForm = new FormGroup({
    drives: new FormControl([], [Validators.required])
  });

  public movesForm = new FormGroup({
    moves: new FormControl([], [Validators.required])
  });

  public featsForm = new FormGroup({
    feats: new FormControl([], [Validators.required])
  });

  public skillsForm = new FormGroup({
    skills: new FormControl([], [Validators.required])
  });

  public itemsForm = new FormGroup({
    items: new FormControl([], [Validators.required])
  });

  public connectionsForm = new FormGroup({
    connections: new FormArray([])
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
    ],
    stat: [
      { type: 'required', message: 'Bonus stat is required.' },
    ]
  };

  public readonly Step = CharacterCreateStep;
  public currentStep: CharacterCreateStep = CharacterCreateStep.CampaignOrNo;

  constructor(
    private campaignAPI: CampaignAPIService,
    private characterAPI: CharacterAPIService
  ) { }

  ngOnInit() {
    this.allContent = cloneDeep((content as any).default || content);
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
    if (this.currentStep === CharacterCreateStep.Archetype)     { this.setStep(CharacterCreateStep.CampaignOrNo); }
    if (this.currentStep === CharacterCreateStep.NameSpecies)   { this.setStep(CharacterCreateStep.Archetype); }
    if (this.currentStep === CharacterCreateStep.BonusStats)    { this.setStep(CharacterCreateStep.NameSpecies); }
    if (this.currentStep === CharacterCreateStep.Background)    { this.setStep(CharacterCreateStep.BonusStats); }
    if (this.currentStep === CharacterCreateStep.Natures)       { this.setStep(CharacterCreateStep.Background); }
    if (this.currentStep === CharacterCreateStep.Drives)        { this.setStep(CharacterCreateStep.Natures); }
    if (this.currentStep === CharacterCreateStep.Moves)         { this.setStep(CharacterCreateStep.Drives); }
    if (this.currentStep === CharacterCreateStep.Feats)         { this.setStep(CharacterCreateStep.Moves); }
    if (this.currentStep === CharacterCreateStep.Skills)        { this.setStep(CharacterCreateStep.Feats); }
    if (this.currentStep === CharacterCreateStep.Items)         { this.setStep(CharacterCreateStep.Skills); }
    if (this.currentStep === CharacterCreateStep.Connections)   { this.setStep(CharacterCreateStep.Items); }
    if (this.currentStep === CharacterCreateStep.Finalize)      { this.setStep(CharacterCreateStep.Connections); }

    this.save();
  }

  next() {
    if (this.currentStep === CharacterCreateStep.Finalize)      { return; }
    if (this.currentStep === CharacterCreateStep.Connections)   { this.setStep(CharacterCreateStep.Finalize); }
    if (this.currentStep === CharacterCreateStep.Items)         { this.setStep(CharacterCreateStep.Connections); }
    if (this.currentStep === CharacterCreateStep.Skills)        { this.setStep(CharacterCreateStep.Items); }
    if (this.currentStep === CharacterCreateStep.Feats)         { this.setStep(CharacterCreateStep.Skills); }
    if (this.currentStep === CharacterCreateStep.Moves)         { this.setStep(CharacterCreateStep.Feats); }
    if (this.currentStep === CharacterCreateStep.Drives)        { this.setStep(CharacterCreateStep.Moves); }
    if (this.currentStep === CharacterCreateStep.Natures)       { this.setStep(CharacterCreateStep.Drives); }
    if (this.currentStep === CharacterCreateStep.Background)    { this.setStep(CharacterCreateStep.Natures); }
    if (this.currentStep === CharacterCreateStep.BonusStats)    { this.setStep(CharacterCreateStep.Background); }
    if (this.currentStep === CharacterCreateStep.NameSpecies)   { this.setStep(CharacterCreateStep.BonusStats); }
    if (this.currentStep === CharacterCreateStep.Archetype)     { this.setStep(CharacterCreateStep.NameSpecies); }
    if (this.currentStep === CharacterCreateStep.CampaignOrNo)  { this.setStep(CharacterCreateStep.Archetype); }

    this.syncFormWithStep();
    this.save();
  }

  private vagabondData(vaga: string) {
    return this.allContent.vagabonds[vaga] || {};
  }

  pickRandomName() {
    this.characterForm.get('name').setValue(sample(this.allContent.core.names));
  }

  private syncFormWithStep() {
    if (!this.chosenVagabond) { return; }

    const bgArr = this.backgroundForm.get('backgrounds') as FormArray;
    if (bgArr.length === 0) {
      this.chosenVagabond.background.forEach(() => {
        bgArr.push(new FormControl('', [Validators.required]));
      });
    }

    const moves = this.movesForm.get('moves').value;
    if (moves.length === 0) {
      this.movesForm.get('moves').setValue([this.chosenVagabond.defaultMove]);
    }

    const connArr = this.connectionsForm.get('connections') as FormArray;
    if (connArr.length === 0) {
      this.chosenVagabond.connections.forEach(() => {
        connArr.push(new FormControl('', [Validators.required]));
      });
    }

  }

  // background functions
  compareAnswer(currentValue, compareValue): boolean {
    return currentValue.text === compareValue.text;
  }

  // nature functions
  getNatureDesc(nature: string): string {
    return this.allContent.core.natures[nature]?.text ?? 'No description entered.';
  }

  // drive functions
  getDriveDesc(drive: string): string {
    return this.allContent.core.drives[drive]?.text ?? 'No description entered.';
  }

  selectDrive(drive: string): void {
    const drives = this.drivesForm.get('drives').value;

    if (drives.includes(drive)) {
      this.drivesForm.get('drives').setValue(drives.filter(x => x !== drive));
      return;
    }

    if (drives.length >= 2) { return; }

    drives.push(drive);
    this.drivesForm.get('drives').setValue(drives);
  }

  // move functions
  getMoveDesc(move: string): string {
    return this.allContent.core.moves[move]?.text ?? 'No description entered.';
  }

  selectMove(move: string): void {
    const moves = this.movesForm.get('moves').value;

    if (moves.includes(move)) {
      this.movesForm.get('moves').setValue(moves.filter(x => x !== move));
      return;
    }

    if (moves.length >= 3) { return; }

    moves.push(move);
    this.movesForm.get('moves').setValue(moves);
  }

  // skill functions
  getSkillDesc(skill: string): string {
    return this.allContent.core.skills[skill]?.text ?? 'No description entered.';
  }

  selectSkill(skill: string): void {
    const skills = this.skillsForm.get('skills').value;

    if (skills.includes(skill)) {
      this.skillsForm.get('skills').setValue(skills.filter(x => x !== skill));
      return;
    }

    if (skills.length >= this.chosenVagabond.numSkills) { return; }

    skills.push(skill);
    this.skillsForm.get('skills').setValue(skills);
  }

  // connection functions
  getConnectionDesc(conn: string): string {
    return this.allContent.core.connections[conn]?.text ?? 'No description entered.';
  }

  setStep(step: CharacterCreateStep): void {
    this.currentStep = step;
  }

  // stat functions
  getStatName(stat: string): string {
    return capitalize(stat);
  }

  getTotalStat(stat: string): number {
    const baseValue = this.chosenVagabond.stats[stat] ?? 0;
    if (stat === this.bonusForm.get('stat').value) { return baseValue + 1; }
    return baseValue;
  }

  reset() {
    this.setStep(CharacterCreateStep.CampaignOrNo);
    this.campaignForm.reset();
    this.archetypeForm.reset();
    this.characterForm.reset();
    this.bonusForm.reset();
    this.backgroundForm.reset();
    this.naturesForm.reset();
    this.drivesForm.reset();
    this.movesForm.reset();
    this.featsForm.reset();
    this.skillsForm.reset();
    this.itemsForm.reset();
    this.connectionsForm.reset();
    this.save();
  }

  load() {
    const loadObject = JSON.parse(localStorage.getItem('newchar') || '{}');

    this.setStep(loadObject._currentStep || CharacterCreateStep.CampaignOrNo);

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

    loadObject.bonus = loadObject.bonus || {};
    loadObject.bonus.stat = loadObject.bonus.stat || '';

    loadObject.background = loadObject.background || {};
    loadObject.background.backgrounds = loadObject.background.backgrounds || [];

    loadObject.natures = loadObject.natures || {};
    loadObject.natures.nature = loadObject.natures.nature || '';

    loadObject.drives = loadObject.drives || {};
    loadObject.drives.drives = loadObject.drives.drives || [];

    loadObject.moves = loadObject.moves || {};
    loadObject.moves.moves = loadObject.moves.moves || [];

    loadObject.feats = loadObject.feats || {};
    loadObject.feats.feats = loadObject.feats.feats || [];

    loadObject.skills = loadObject.skills || {};
    loadObject.skills.skills = loadObject.skills.skills || [];

    loadObject.items = loadObject.items || {};
    loadObject.items.items = loadObject.items.items || [];

    loadObject.connections = loadObject.connections || {};
    loadObject.connections.connections = loadObject.connections.connections || [];

    // create extra form objects
    loadObject.background.backgrounds.forEach(bg => {
      const bgArr = this.backgroundForm.get('backgrounds') as FormArray;
      bgArr.push(new FormControl(bg, [Validators.required]));
    });

    loadObject.connections.connections.forEach(conn => {
      const connArr = this.connectionsForm.get('connections') as FormArray;
      connArr.push(new FormControl(conn, [Validators.required]));
    });

    // set all of the form values
    this.campaignForm.setValue(loadObject.campaign || {});
    this.archetypeForm.setValue(loadObject.archetype || {});
    this.characterForm.setValue(loadObject.character || {});
    this.bonusForm.setValue(loadObject.bonus || {});
    this.backgroundForm.setValue(loadObject.background || {});
    this.naturesForm.setValue(loadObject.natures || {});
    this.drivesForm.setValue(loadObject.drives || {});
    this.movesForm.setValue(loadObject.moves || {});
    this.featsForm.setValue(loadObject.feats || {});
    this.skillsForm.setValue(loadObject.skills || {});
    this.itemsForm.setValue(loadObject.items || {});
    this.connectionsForm.setValue(loadObject.connections || {});
  }

  private getSaveObject() {
    return {
      _currentStep: this.currentStep,
      campaign: this.campaignForm.value,
      archetype: this.archetypeForm.value,
      character: this.characterForm.value,
      bonus: this.bonusForm.value,
      background: this.backgroundForm.value,
      natures: this.naturesForm.value,
      drives: this.drivesForm.value,
      moves: this.movesForm.value,
      feats: this.featsForm.value,
      skills: this.skillsForm.value,
      items: this.itemsForm.value,
      connections: this.connectionsForm.value
    };
  }

  save() {
    const saveObject = this.getSaveObject();

    localStorage.setItem('newchar', JSON.stringify(saveObject));
  }

  confirm() {
    // TODO: confirm dialog
    // TODO: navigate to character view
    // TODO: call reset
    this.characterAPI.createCharacter(this.getSaveObject())
      .subscribe(char => {
        console.log('create', char);
      });
  }

}
