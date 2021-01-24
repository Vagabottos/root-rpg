
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonCheckbox, PopoverController } from '@ionic/angular';

import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { capitalize, sumBy } from 'lodash';

import { CampaignAPIService } from '../../services/campaign.api.service';
import { CharacterAPIService } from '../../services/character.api.service';

import { IContentBackgroundQuestion, IContentVagabond, IItem, ICampaign } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { ItemService } from '../../services/item.service';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { NotificationService } from '../../services/notification.service';
import { ItemCreatorService } from '../../services/item-creator.service';

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

  public get chosenVagabond(): IContentVagabond {
    return this.contentService.getVagabond(this.archetypeForm.get('archetype').value);
  }

  public get validSpecies() {
    const vagabond = this.chosenVagabond;
    return [
      ...this.contentService.getSpecies(),
      ...(vagabond.species || [])
    ];
  }

  public get validFactions() {
    return [
      ...this.contentService.getDefaultFactions()
    ];
  }

  public get totalValueSpent(): number {
    return sumBy(this.itemsForm.get('items').value, i => this.itemService.value(i));
  }

  public campaign: ICampaign;
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
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    species: new FormControl('', [Validators.required]),
    customspecies: new FormControl(''),
    pronouns: new FormControl('', [Validators.required]),
    adjectives: new FormControl([], [Validators.required]),
    demeanor: new FormControl([], [Validators.required])
  });

  public bonusForm = new FormGroup({
    stat: new FormControl('', [Validators.required])
  });

  public backgroundForm = new FormGroup({
    backgrounds: new FormArray([]),
    backgroundReps: new FormControl([])
  });

  public naturesForm = new FormGroup({
    nature: new FormControl('', [Validators.required])
  });

  public drivesForm = new FormGroup({
    drives: new FormControl([], [Validators.required]),
    driveTargets: new FormControl({})
  });

  public movesForm = new FormGroup({
    moves: new FormControl([], [Validators.required])
  });

  public featsForm = new FormGroup({
    feats: new FormControl([], [Validators.required, ])
  });

  public skillsForm = new FormGroup({
    skills: new FormControl([], [Validators.required]),
    bonusSkills: new FormControl([])
  });

  public itemsForm = new FormGroup({
    items: new FormControl([], [Validators.required])
  });

  public connectionsForm = new FormGroup({
    connections: new FormArray([])
  });

  public validationMessages = {
    campaignId: [
      { type: 'required',  message: 'Campaign ID is required.' },
      { type: 'minlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'maxlength', message: 'Campaign ID must be exactly 24 characters long.' },
      { type: 'notexists', message: 'Campaign does not exist.' },
      { type: 'locked',    message: 'Campaign is locked and cannot be joined.' }
    ],
    archetype: [
      { type: 'required', message: 'Archetype is required.' },
    ],
    name: [
      { type: 'required', message: 'Name is required.' },
      { type: 'maxlength', message: 'Name must be less than 20 characters.' },
    ],
    species: [
      { type: 'required', message: 'Species is required.' },
    ],
    customspecies: [
      { type: 'required', message: 'Custom species is required.' },
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

  public stepHelper = [
    { name: 'Join Campaign?',
      step: CharacterCreateStep.CampaignOrNo,
      isValid: () => this.campaignForm.valid },
    { name: 'Archetype',
      step: CharacterCreateStep.Archetype,
      isValid: () => this.archetypeForm.valid },
    { name: 'Name, Species, Look',
      step: CharacterCreateStep.NameSpecies,
      isValid: () => this.characterForm.valid },
    { name: 'Bonus Stat',
      step: CharacterCreateStep.BonusStats,
      isValid: () => this.bonusForm.valid },
    { name: 'Background',
      step: CharacterCreateStep.Background,
      isValid: () => this.backgroundForm.valid },
    { name: 'Nature',
      step: CharacterCreateStep.Natures,
      isValid: () => this.naturesForm.valid },
    { name: 'Drives',
      step: CharacterCreateStep.Drives,
      isValid: () => this.drivesForm.valid && this.drivesForm.get('drives').value.length >= 2 },
    { name: 'Moves',
      step: CharacterCreateStep.Moves,
      isValid: () => this.movesForm.valid && this.movesForm.get('moves').value.length >= 3 },
    { name: 'Roguish Feats',
      step: CharacterCreateStep.Feats,
      isValid: () => [
                      CharacterCreateStep.Skills,
                      CharacterCreateStep.Items,
                      CharacterCreateStep.Connections,
                      CharacterCreateStep.Finalize
                    ].includes(this.currentStep)
                  && (this.chosenVagabond.chooseFeats === 0
                    || (this.featsForm.get('feats').value.length >= this.chosenVagabond.chooseFeats)) },
    { name: 'Weapon Skills',
      step: CharacterCreateStep.Skills,
      isValid: () => this.skillsForm.valid },
    { name: 'Starting Items',
      step: CharacterCreateStep.Items,
      isValid: () => this.totalValueSpent < this.chosenVagabond.startingValue
                  && [CharacterCreateStep.Connections, CharacterCreateStep.Finalize].includes(this.currentStep) },
    { name: 'Connections',
      step: CharacterCreateStep.Connections,
      isValid: () => this.connectionsForm.valid },
    { name: 'Finalize',
      step: CharacterCreateStep.Finalize,
      touched: () => false,
      isValid: () => true },
  ];

  constructor(
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private popover: PopoverController,
    private router: Router,
    private notification: NotificationService,
    private itemCreator: ItemCreatorService,
    public contentService: ContentService,
    private itemService: ItemService,
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
    this.campaign = null;

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

                this.campaign = res;
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

  pickRandomName() {
    this.characterForm.get('name').setValue(this.contentService.getRandomName());
  }

  changeSpecies(event) {
    const isCustom = event.detail.value === 'custom';
    setTimeout(() => {
      if (isCustom) {
        this.characterForm.get('customspecies').setValidators([Validators.required]);
        this.characterForm.get('customspecies').updateValueAndValidity();
        return;
      }

      this.characterForm.get('customspecies').setValue('');
      this.characterForm.get('customspecies').setValidators([]);
      this.characterForm.get('customspecies').updateValueAndValidity();
    }, 0);
  }

  private loadLinkedCampaign() {
    const campaignId = this.campaignForm.get('campaignId').value;
    if (!campaignId) { return; }

    this.campaignAPI.loadCampaign(campaignId)
      .subscribe(campaign => {
        this.campaign = campaign;
      });
  }

  private async syncFormWithStep() {
    if (!this.chosenVagabond) { return; }

    const bgArr = this.backgroundForm.get('backgrounds') as FormArray;
    if (bgArr.length === 0) {
      this.chosenVagabond.background.forEach(() => {
        bgArr.push(new FormControl('', [Validators.required]));
      });
    }

    const moves = this.movesForm.get('moves').value || [];
    if (moves.length === 0 && this.chosenVagabond.defaultMoves?.length > 0) {
      this.movesForm.get('moves').setValue(this.chosenVagabond.defaultMoves);
    }

    const connArr = this.connectionsForm.get('connections') as FormArray;
    if (connArr.length === 0) {
      this.chosenVagabond.connections.forEach(() => {
        connArr.push(new FormControl('', [Validators.required]));
      });
    }

    const items = this.itemsForm.get('items').value;
    const validToolboxSteps = [
      CharacterCreateStep.Feats,
      CharacterCreateStep.Skills,
      CharacterCreateStep.Items
    ];

    if (validToolboxSteps.includes(this.currentStep) && items.length === 0 && moves.includes('Toolbox')) {
      this.createItem(null, this.contentService.getMove('Toolbox').customItemData);
    }

    this.loadLinkedCampaign();

  }

  // background functions
  compareAnswer(currentValue, compareValue): boolean {
    return currentValue.text === compareValue.text;
  }

  async changeAnswer(event, qa: IContentBackgroundQuestion, index: number): Promise<void> {
    if (qa.type !== 'answers') { return; }

    const ans = event.detail.value;
    if (ans.factionDelta) {
      const updControl = this.backgroundForm.get('backgroundReps');
      const value = updControl.value;
      value[index] = null;
      updControl.setValue(value);

      const factions = this.campaign ? this.campaign.factions : this.validFactions.map(f => f.name);

      const modal = await this.notification.loadForcedChoiceModal({
        title: `Choose Faction`,
        message: `Choose a faction for the background question.`,
        choices: factions.map(x => ({ name: x, text: '' })),
        numChoices: 1
      });

      modal.onDidDismiss().then(({ data }) => {
        if (!data) {
          event.srcElement.value = '';
          return;
        }

        this.changeBackgroundRep(data[0].name, qa, index);
      });
    }
  }

  changeBackgroundRep(value: string, qa: IContentBackgroundQuestion, index: number): void {

    const checkVal = this.backgroundForm.get('backgrounds').value[index].text;
    const checkIdx = qa.answers.findIndex(ans => ans.text === checkVal);

    const updControl = this.backgroundForm.get('backgroundReps');
    const updValue = updControl.value;
    updValue[index] = { faction: value, delta: qa.answers?.[checkIdx]?.factionDelta ?? 0 };
    updControl.setValue(updValue);
  }

  // nature functions
  getNatureDesc(nature: string): string {
    return this.contentService.getNature(nature)?.text ?? 'No description entered.';
  }

  // drive functions
  getDriveDesc(drive: string): string {
    return this.contentService.getDrive(drive)?.text ?? 'No description entered.';
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

  doesDriveName(drive: string): boolean {
    return this.contentService.getDrive(drive)?.namedTarget;
  }

  updateDriveTarget(event, drive: string): void {
    const control = this.drivesForm.get('driveTargets');
    const val = control.value || {};

    val[drive] = event.detail.value;

    control.setValue(val);
  }

  // feat functions
  getFeatDesc(feat: string): string {
    return this.contentService.getFeat(feat)?.text ?? 'No description entered.';
  }

  selectFeat(feat: string): void {
    const feats = this.featsForm.get('feats').value;

    if (feats.includes(feat)) {
      this.featsForm.get('feats').setValue(feats.filter(x => x !== feat));
      return;
    }

    if (feats.length >= this.chosenVagabond.chooseFeats) { return; }

    feats.push(feat);
    this.featsForm.get('feats').setValue(feats);
  }

  getBonusFeats(): string[] {
    return this.movesForm.get('moves').value.map(x => this.contentService.getMove(x)?.addFeat).flat().filter(Boolean);
  }

  getAllFeats(): string[] {
    const feats = this.getBonusFeats();
    return this.chosenVagabond.feats.map(x => x.name).concat(feats);
  }

  getBonusFeatsAndFormData(): string[] {
    return this.featsForm.get('feats').value.concat(this.getBonusFeats());
  }

  // move functions
  getMoveDesc(move: string): string {
    return this.contentService.getMove(move)?.text ?? 'No description entered.';
  }

  async selectMove(move: string, checkbox: IonCheckbox): Promise<void> {
    const moves = this.movesForm.get('moves').value;

    if (moves.includes(move)) {
      this.movesForm.get('moves').setValue(moves.filter(x => x !== move));
      return;
    }

    if (moves.length >= 3) { return; }

    const moveData = this.contentService.getMove(move);
    if (moveData.addSkill && moveData.addSkillChoose) {
      if (checkbox.checked) {
        const modal = await this.notification.loadForcedChoiceModal({
          title: `Choose ${moveData.addSkillChoose} Skills`,
          message: `Choose ${moveData.addSkillChoose} skills from the following list for the move ${move}.`,
          choices: moveData.addSkill.map(c => ({ name: c, text: '' })) || [],
          numChoices: moveData.addSkillChoose || 1
        });

        modal.onDidDismiss().then(({ data }) => {
          setTimeout(() => {
            if (!data || !data.length) {
              checkbox.checked = false;
              return;
            }

            this.skillsForm.get('bonusSkills').setValue(data.map(x => x.name));
            moves.push(move);
            this.movesForm.get('moves').setValue(moves);
          }, 0);
        });

      } else {
        this.skillsForm.get('bonusSkills').setValue([]);

      }

    } else {
      moves.push(move);
      this.movesForm.get('moves').setValue(moves);
    }
  }

  // skill functions
  getAddSkills(move: string): string[] {
    return this.contentService.getMove(move)?.addSkill || [];
  }

  getSkillDesc(skill: string): string {
    return this.contentService.getSkill(skill)?.text ?? 'No description entered.';
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

  getBonusSkills(): string[] {
    return this.movesForm.get('moves').value
      .filter(x => {
        const move = this.contentService.getMove(x);
        return move.addSkill && !move.addSkillChoose;
      })
      .map(x => this.contentService.getMove(x)?.addSkill)
      .flat()
      .filter(Boolean);
  }

  getBonusSkillsAndFormData(): string[] {
    return this.skillsForm.get('skills').value.concat(this.skillsForm.get('bonusSkills').value).concat(this.getBonusSkills());
  }

  // connection functions
  getConnectionDesc(conn: string): string {
    return this.contentService.getConnection(conn)?.text ?? 'No description entered.';
  }

  setStep(step: CharacterCreateStep): void {
    this.currentStep = step;
    this.save();
  }

  // stat functions
  getStatName(stat: string): string {
    return capitalize(stat);
  }

  getStatDesc(stat: string): string {
    return this.contentService.getStat(stat).text;
  }

  getTotalStat(stat: string): number {
    const baseValue = this.chosenVagabond.stats[stat] ?? 0;
    const bonus = this.movesForm.get('moves').value.reduce((prev, cur) => prev + (this.contentService.getMove(cur)?.addStat?.[stat] ?? 0), 0);
    if (stat === this.bonusForm.get('stat').value) { return baseValue + bonus + 1; }
    return baseValue + bonus;
  }

  // item functions
  async createItem(item?: IItem, itemData?: any): Promise<any> {
    const modal = await this.itemCreator.createItem(item, itemData);

    modal.onDidDismiss().then((res) => {
      const resItem = res.data;
      if (!resItem) { return; }

      const control = this.itemsForm.get('items');

      if (item) {
        const replaceIdx = control.value.findIndex(x => x.name === item.name);
        control.value[replaceIdx] = resItem;

      } else {
        control.value.push(resItem);
      }
    });

    modal.present();
  }

  editItem(item: IItem): void {
    this.createItem(item);
  }

  removeItem(item: IItem): void {
    const control = this.itemsForm.get('items');
    control.setValue(control.value.filter(x => x.name !== item.name));
  }

  async showItemEditActionSheet(item: IItem) {
    const buttons: any[] = [
      {
        text: 'Edit',
        icon: 'pencil',
        handler: () => {
          this.editItem(item);
        }
      }
    ];

    if (!item.tagSet) {
      buttons.unshift({
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.removeItem(item);
        }
      });
    }

    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons
    });

    actionSheet.present();
  }

  async showItemEditPopover(item: IItem, event) {
    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'edit') {
        this.editItem(item);
      }

      if (resAct === 'delete') {
        this.removeItem(item);
      }
    });

    popover.present();
  }

  reset() {
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
    this.setStep(CharacterCreateStep.CampaignOrNo);
    this.save();
  }

  resetVagabond() {
    (this.backgroundForm.get('backgrounds') as FormArray).clear();
    (this.connectionsForm.get('connections') as FormArray).clear();

    this.characterForm.reset();
    this.bonusForm.reset();
    this.backgroundForm.reset();
    this.naturesForm.reset();
    this.drivesForm.get('drives').setValue([]);
    this.movesForm.get('moves').setValue([]);
    this.featsForm.get('feats').setValue([]);
    this.skillsForm.get('skills').setValue([]);
    this.itemsForm.get('items').setValue([]);
    this.connectionsForm.get('connections').setValue([]);

    this.connectionsForm.reset();

    this.featsForm.setErrors({ fake: true });
    this.backgroundForm.setErrors({ fake: true });
    this.connectionsForm.setErrors({ fake: true });
  }

  load() {
    const loadObject = JSON.parse(localStorage.getItem('newchar') || '{}');

    loadObject.campaign = loadObject.campaign || {};
    loadObject.campaign.campaignId = loadObject.campaign.campaignId || '';

    loadObject.archetype = loadObject.archetype || {};
    loadObject.archetype.archetype = loadObject.archetype.archetype || '';

    loadObject.character = loadObject.character || {};
    loadObject.character.name = loadObject.character.name || '';
    loadObject.character.species = loadObject.character.species || '';
    loadObject.character.customspecies = loadObject.character.customspecies || '';
    loadObject.character.pronouns = loadObject.character.pronouns || '';
    loadObject.character.adjectives = loadObject.character.adjectives || [];
    loadObject.character.demeanor = loadObject.character.demeanor || [];

    loadObject.bonus = loadObject.bonus || {};
    loadObject.bonus.stat = loadObject.bonus.stat || '';

    loadObject.background = loadObject.background || {};
    loadObject.background.backgrounds = loadObject.background.backgrounds || [];
    loadObject.background.backgroundReps = loadObject.background.backgroundReps || [];

    loadObject.natures = loadObject.natures || {};
    loadObject.natures.nature = loadObject.natures.nature || '';

    loadObject.drives = loadObject.drives || {};
    loadObject.drives.drives = loadObject.drives.drives || [];
    loadObject.drives.driveTargets = loadObject.drives.driveTargets || {};

    loadObject.moves = loadObject.moves || {};
    loadObject.moves.moves = loadObject.moves.moves || [];

    loadObject.feats = loadObject.feats || {};
    loadObject.feats.feats = loadObject.feats.feats || [];

    loadObject.skills = loadObject.skills || {};
    loadObject.skills.skills = loadObject.skills.skills || [];
    loadObject.skills.bonusSkills = loadObject.skills.bonusSkills || [];

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

    this.setStep(loadObject._currentStep || CharacterCreateStep.CampaignOrNo);

    this.loadLinkedCampaign();
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

  async confirm() {
    const alert = await this.alert.create({
      header: 'Create Character?',
      message: 'Do you want to finish creating this character?',
      backdropDismiss: false,
      buttons: [
        'Cancel',
        {
          text: 'Yes, Create',
          handler: () => {
            this.characterAPI.createCharacter(this.getSaveObject())
              .subscribe(char => {
                this.reset();
                this.notification.notify('Created character successfully!');
                this.router.navigate(['/dashboard', 'characters', 'view', char._id]);
              });
          }
        }
      ]
    });

    alert.present();
  }

}
