
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BlocksLeave } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<BlocksLeave> {

  constructor(
    private alert: AlertController
  ) {}

  // ask user if they want to leave a page before just doing it
  async canDeactivate(component: BlocksLeave): Promise<boolean> {
    if (component.isDone) { return true; }

    const alert = await this.alert.create({
      header: 'Leave Page',
      message: `Are you sure you want to go back? Your in-progress data will be lost and you will have to redo it from scratch.`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, leave',
          role: 'leave',
          handler: () => {}
        }
      ]
    });

    await alert.present();

    const data = await alert.onDidDismiss();
    return data.role === 'leave';

  }
}
