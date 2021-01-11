import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { ICharacter, IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { ItemCreatorService } from '../../services/item-creator.service';
import { NotificationService } from '../../services/notification.service';

enum AdvancementStep {
  Choose = 'choose',
  Stat = 'stat',
  MyPlaybook = 'myplaybook',
  DifferentPlaybook = 'differentplaybook',
  WeaponSkills = 'weaponskills',
  RoguishFeats = 'roguishfeats',
  HarmBox = 'harmbox',
  Connections = 'connections'
}

@Component({
  selector: 'app-advancement',
  templateUrl: './advancement.component.html',
  styleUrls: ['./advancement.component.scss'],
})
export class AdvancementComponent implements OnInit {

  public readonly Step = AdvancementStep;
  public currentStep: AdvancementStep = AdvancementStep.Choose;

  public chosenStat: string;
  public chosenHarm: string;
  public chosenConnections = [{ name: '', target: '' }, { name: '', target: '' }];
  public chosenSkills: string[] = [];
  public chosenFeats: string[] = [];
  public chosenMove: string;
  public bonusSkills: string[] = [];
  public bonusItem: IItem = null;

  public readonly advancementTypes = [
    { step: AdvancementStep.Stat,               name: 'Take +1 to a stat (max +2 each)',
      disabled: (character: ICharacter) => Object.values(character.stats).every(x => x >= 2)  },

    { step: AdvancementStep.MyPlaybook,         name: 'Take a new move from your playbook (max 5)',
      disabled: (character: ICharacter) => character.moves.filter(x => this.content.getMove(x)?.archetype === character.archetype).length >= 5 },

    { step: AdvancementStep.DifferentPlaybook,  name: 'Take a new move from another playbook (max 2)',
      disabled: (character: ICharacter) => character.moves.filter(x => this.content.getMove(x)?.archetype !== character.archetype).length >= 2 },

    { step: AdvancementStep.WeaponSkills,       name: 'Take up to two new weapon skills (max 7)',
      disabled: (character: ICharacter) => character.skills.length >= 7 },

    { step: AdvancementStep.RoguishFeats,       name: 'Take up to two new roguish feats (max 6)',
      disabled: (character: ICharacter) => character.feats.length >= 6 },

    { step: AdvancementStep.HarmBox,            name: 'Add one box to any one harm track (max 6 each)',
      disabled: (character: ICharacter) => ['injury', 'exhaustion', 'depletion'].every(h => character.harmBoost[h] >= 2) },

    { step: AdvancementStep.Connections,        name: 'Take up to two new connections (max 6 total)',
      disabled: (character: ICharacter) => character.connections.length >= 6 }
  ];

  public allMoves: Record<string, any[]> = {};

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    private notification: NotificationService,
    private itemCreator: ItemCreatorService,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.allMoves = this.content.getMovesByArchetype();
  }

  setAdvancementStep(step: AdvancementStep) {
    this.currentStep = step;
  }

  back() {
    this.setAdvancementStep(AdvancementStep.Choose);

    this.chosenStat = '';
    this.chosenHarm = '';
    this.chosenMove = '';
    this.chosenConnections = [];
    this.chosenFeats = [];
    this.chosenSkills = [];
    this.bonusSkills = [];
    this.bonusItem = null;
  }

  private save() {
    this.data.patchCharacter();
  }

  async confirmStat(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Stat',
      message: `Are you sure you want to advance the ${this.chosenStat} stat?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.stats[this.chosenStat] += 1;
            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmHarm(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Harm',
      message: `Are you sure you want to advance the ${this.chosenHarm} harm track?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.harmBoost[this.chosenHarm] = character.harmBoost[this.chosenHarm] || 0;
            character.harmBoost[this.chosenHarm] += 1;
            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmConnections(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Connections',
      message: `Are you sure you want to add these two new connections (${this.chosenConnections[0].name}, ${this.chosenConnections[1].name})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.connections.push(...this.chosenConnections);

            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmMove(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Move',
      message: `Are you sure you want to add the move "${this.chosenMove}"?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.moves.push(this.chosenMove);
            if (this.bonusSkills?.length > 0) {
              character.moveSkills.push(...this.bonusSkills);
            }

            if (this.bonusItem) {
              character.items.push(this.bonusItem);
            }

            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmSkills(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Skills',
      message: `Are you sure you want to add these new weapon skills (${this.chosenSkills.filter(Boolean).join(', ')})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.skills.push(...this.chosenSkills.filter(Boolean));

            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmFeats(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance: Feats',
      message: `Are you sure you want to add these new roguish feats (${this.chosenFeats.filter(Boolean).join(', ')})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.feats.push(...this.chosenFeats.filter(Boolean));

            this.save();
            this.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async changeMove(event, character: ICharacter): Promise<void> {

    const move = event.detail.value;

    this.bonusSkills = [];
    this.bonusItem = null;

    const moveData = this.content.getMove(move);
    if (!moveData) { return; }

    if (moveData.addSkillChoose > 0 && moveData.addSkill) {

      const modal = await this.notification.loadForcedChoiceModal(
        `Choose ${moveData.addSkillChoose} Skills`,
        `Choose ${moveData.addSkillChoose} skills from the following list for the move ${move}.`,
        moveData.addSkill || [],
        moveData.addSkillChoose || 1,
        character.moveSkills.concat(character.skills)
      );

      modal.onDidDismiss().then(({ data }) => {
        if (!data) {
          setTimeout(() => {
            this.chosenMove = '';
          }, 0);
          return;
        }

        this.bonusSkills = data;
      });
    }

    if (moveData.customItemData) {
      const modal = await this.itemCreator.createItem(null, moveData.customItemData);

      modal.onDidDismiss().then((res) => {
        const resItem = res.data;
        if (!resItem) {
          setTimeout(() => {
            this.chosenMove = '';
          }, 0);
          return;
        }

        this.bonusItem = resItem;
      });

      modal.present();
    }
  }

  allSkills(character: ICharacter): string[] {
    return character.skills.concat(character.moveSkills).concat(this.skillsFromMoves(character));
  }

  allFeats(character: ICharacter): string[] {
    return character.feats.concat(this.featsFromMoves(character));
  }

  skillsFromMoves(character: ICharacter): string[] {
    return character.moves.map(x => this.content.getMove(x)?.addSkill).flat().filter(Boolean);
  }

  featsFromMoves(character: ICharacter): string[] {
    return character.moves.map(x => this.content.getMove(x)?.addFeat).flat().filter(Boolean);
  }

  dismiss() {
    this.modal.dismiss();
  }

}
