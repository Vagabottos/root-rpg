import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ICharacter } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

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

  public readonly advancementTypes = [
    { step: AdvancementStep.Stat,               name: 'Take +1 to a stat (max +2 each)',
      disabled: (character: ICharacter) => Object.values(character.stats).every(x => x >= 2)  },

    { step: AdvancementStep.MyPlaybook,         name: 'Take a new move from your playbook (max 5)',
      disabled: (character: ICharacter) => false },

    { step: AdvancementStep.DifferentPlaybook,  name: 'Take a new move from another playbook (max 2)',
      disabled: (character: ICharacter) => false },

    { step: AdvancementStep.WeaponSkills,       name: 'Take up to two new weapon skills (max 7)',
      disabled: (character: ICharacter) => character.skills.length >= 7 },

    { step: AdvancementStep.RoguishFeats,       name: 'Take up to two new roguish feats (max 6)',
      disabled: (character: ICharacter) => character.feats.length >= 6 },

    { step: AdvancementStep.HarmBox,            name: 'Add one box to any one harm track (max 6 each)',
      disabled: (character: ICharacter) => ['injury', 'exhaustion', 'depletion'].every(h => character.harmBoost[h] >= 2) },

    { step: AdvancementStep.Connections,        name: 'Take up to two new connections (max 6 total)',
      disabled: (character: ICharacter) => character.connections.length >= 6 }
  ];

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {}

  setAdvancementStep(step: AdvancementStep) {
    this.currentStep = step;
  }

  back() {
    this.setAdvancementStep(AdvancementStep.Choose);

    this.chosenStat = '';
    this.chosenHarm = '';
  }

  private save() {
    this.data.patchCharacter();
  }

  async confirmStat(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance Stat',
      message: `Are you sure you want to advance the ${this.chosenStat} stat?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.stats[this.chosenStat] += 1;
            this.save();
            this.modal.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmHarm(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance Harm',
      message: `Are you sure you want to advance the ${this.chosenHarm} harm track?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.harmBoost[this.chosenHarm] = character.harmBoost[this.chosenHarm] || 0;
            character.harmBoost[this.chosenHarm] += 1;
            this.save();
            this.modal.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmConnections(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance Connections',
      message: `Are you sure you want to add these two new connections (${this.chosenConnections[0].name}, ${this.chosenConnections[1].name})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.connections.push(...this.chosenConnections);

            this.save();
            this.modal.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmMyMove(character: ICharacter) {

  }

  async confirmOtherMove(character: ICharacter) {

  }

  async confirmSkills(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance Skills',
      message: `Are you sure you want to add these new weapon skills (${this.chosenSkills.filter(Boolean).join(', ')})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.skills.push(...this.chosenSkills.filter(Boolean));

            this.save();
            this.modal.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  async confirmFeats(character: ICharacter) {
    const alert = await this.alert.create({
      header: 'Advance Feats',
      message: `Are you sure you want to add these new roguish feats (${this.chosenFeats.filter(Boolean).join(', ')})?`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, advance',
          handler: () => {
            character.feats.push(...this.chosenFeats.filter(Boolean));

            this.save();
            this.modal.dismiss();
          }
        }
      ]
    });

    alert.present();
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
