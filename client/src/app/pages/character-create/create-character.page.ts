
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { capitalize, cloneDeep, sample, sumBy } from 'lodash';

import { CampaignAPIService } from '../../services/campaign.api.service';
import { CharacterAPIService } from '../../services/character.api.service';

import { IContentVagabond, IItem } from '../../../../../shared/interfaces';
import { ContentService } from '../../services/content.service';
import { ItemService } from '../../services/item.service';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ItemCreatorComponent } from '../../components/item-creator/item-creator.component';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

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
      ...this.contentService.getFactions()
    ];
  }

  public get totalValueSpent(): number {
    return sumBy(this.itemsForm.get('items').value, i => this.itemService.value(i));
  }

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
      { type: 'maxlength', message: 'Name must be less than 20 characters.' },
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
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private modal: ModalController,
    private popover: PopoverController,
    private router: Router,
    private notification: NotificationService,
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

  pickRandomName() {
    this.characterForm.get('name').setValue(sample(this.contentService.getNames()));
  }

  private syncFormWithStep() {
    if (!this.chosenVagabond) { return; }

    const bgArr = this.backgroundForm.get('backgrounds') as FormArray;
    if (bgArr.length === 0) {
      this.chosenVagabond.background.forEach(() => {
        bgArr.push(new FormControl('', [Validators.required]));
      });
    }

    const moves = this.movesForm.get('moves').value || [];
    if (moves.length === 0 && this.chosenVagabond.defaultMove) {
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

  // move functions
  getMoveDesc(move: string): string {
    return this.contentService.getMove(move)?.text ?? 'No description entered.';
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
    if (stat === this.bonusForm.get('stat').value) { return baseValue + 1; }
    return baseValue;
  }

  // item functions
  async createItem(item?: IItem) {
    const modal = await this.modal.create({
      component: ItemCreatorComponent,
      componentProps: { item: cloneDeep(item) }
    });

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

    await modal.present();
  }

  editItem(item: IItem): void {
    this.createItem(item);
  }

  removeItem(item: IItem): void {
    const control = this.itemsForm.get('items');
    control.setValue(control.value.filter(x => x.name !== item.name));
  }

  async showItemEditActionSheet(item: IItem) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removeItem(item);
          }
        },
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.editItem(item);
          }
        }
      ]
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

    this.setStep(loadObject._currentStep || CharacterCreateStep.CampaignOrNo);
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
