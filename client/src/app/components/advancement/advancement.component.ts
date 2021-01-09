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

  public readonly advancementTypes = [
    { step: AdvancementStep.Stat,               name: 'Take +1 to a stat (max +2)',  },
    { step: AdvancementStep.MyPlaybook,         name: 'Take a new move from your playbook (max 5)' },
    { step: AdvancementStep.DifferentPlaybook,  name: 'Take a new move from another playbook (max 2)' },
    { step: AdvancementStep.WeaponSkills,       name: 'Take up to two new weapon skills (max 7)' },
    { step: AdvancementStep.RoguishFeats,       name: 'Take up to two new roguish feats (max 6)' },
    { step: AdvancementStep.HarmBox,            name: 'Add one box to any one harm track (max 6 each)' },
    { step: AdvancementStep.Connections,        name: 'Take up to two new connections (max 6 total)' }
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

  dismiss() {
    this.modal.dismiss();
  }

}
