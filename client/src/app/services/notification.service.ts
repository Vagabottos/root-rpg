import { Injectable } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ForceSelectorComponent } from '../components/force-selector/force-selector.component';

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

  async loadForcedChoiceModal(title: string, message: string, choices: string[], numChoices: number, bannedChoices = []): Promise<any> {
    const modal = await this.modal.create({
      component: ForceSelectorComponent,
      componentProps: {
        title, message, choices, numChoices, bannedChoices
      }
    });

    modal.present();

    return modal;
  }
}
