import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ForceSelectorComponent } from '../components/force-selector/force-selector.component';

interface ForcedChoiceOpts {
  title: string;
  message: string;
  choices: Array<{ name: string, text: string }>;
  numChoices?: number;
  bannedChoices?: string[];
  disableBanned?: boolean;
  defaultSelected?: string[];
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
    defaultSelected
  }: ForcedChoiceOpts = {
    title: '',
    message: '',
    choices: [],
    numChoices: 0,
    bannedChoices: [],
    disableBanned: false,
    defaultSelected: []
  }): Promise<any> {
    const modal = await this.modal.create({
      component: ForceSelectorComponent,
      componentProps: {
        title, message, choices, numChoices, bannedChoices, disableBanned, defaultSelected
      }
    });

    modal.present();

    return modal;
  }
}
