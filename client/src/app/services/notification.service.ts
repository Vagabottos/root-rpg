import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ICampaign } from '../../interfaces';
import { DiceRollerComponent } from '../components/dice-roller/dice-roller.component';
import { ForceSelectorComponent } from '../components/force-selector/force-selector.component';
import { WoodlandOverviewComponent } from '../components/woodland-overview/woodland-overview.component';

interface ForcedChoiceOpts {
  title: string;
  message: string;
  choices: Array<{ name: string, text: string }>;
  numChoices?: number;
  bannedChoices?: string[];
  disableBanned?: boolean;
  disableChoices?: string[];
  defaultSelected?: string[];
  allowCustom?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toast: ToastController,
    private modal: ModalController
  ) { }

  async notify(message: string): Promise<void> {
    const toast = await this.toast.create({
      duration: 3000,
      message,
      buttons: [
        {
          side: 'end',
          role: 'cancel',
          text: 'Close'
        }
      ]
    });

    await toast.present();
  }

  async loadForcedChoiceModal({
    title,
    message,
    choices,
    numChoices,
    bannedChoices,
    disableBanned,
    defaultSelected,
    disableChoices,
    allowCustom
  }: ForcedChoiceOpts = {
    title: '',
    message: '',
    choices: [],
    numChoices: 0,
    bannedChoices: [],
    disableBanned: false,
    disableChoices: [],
    defaultSelected: [],
    allowCustom: false
  }): Promise<any> {
    const modal = await this.modal.create({
      component: ForceSelectorComponent,
      componentProps: {
        title, message, choices, numChoices, bannedChoices,
        disableBanned, defaultSelected, allowCustom,
        disableChoices
      }
    });

    modal.present();

    return modal;
  }

  async loadWoodlandMap(campaign: ICampaign) {
    const modal = await this.modal.create({
      component: WoodlandOverviewComponent,
      componentProps: { campaign },
      cssClass: 'big-modal'
    });

    await modal.present();
  }

  async rollDice() {
    const dice = await this.modal.create({
      component: DiceRollerComponent,
      cssClass: 'transparent',
      showBackdrop: false
    });

    dice.present();
  }
}
