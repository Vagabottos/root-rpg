import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toast: ToastController) { }

  async notify(message: string) {
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
}
