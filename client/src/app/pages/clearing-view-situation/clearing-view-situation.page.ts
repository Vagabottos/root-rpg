import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { merge, cloneDeep } from 'lodash';

import { IClearing } from '../../../interfaces';
import { ClearingBackgroundComponent } from '../../components/clearing-background/clearing-background.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-situation',
  templateUrl: './clearing-view-situation.page.html',
  styleUrls: ['./clearing-view-situation.page.scss'],
})
export class ClearingViewSituationPage implements OnInit {

  public isEditing: boolean;
  public clearingCopy: IClearing;

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit(clearing: IClearing) {
    this.clearingCopy = cloneDeep(clearing);
    this.isEditing = !this.isEditing;
  }

  async confirmEdit(clearing: IClearing) {
    const alert = await this.alert.create({
      header: 'Confirm Changes',
      message: `Are you sure you want to make these changes?`,
      buttons: [
        'Cancel',
        {
          text: 'Discard changes',
          handler: () => {
            this.isEditing = false;
          }
        },
        {
          text: 'Yes, confirm',
          handler: () => {
            merge(clearing, this.clearingCopy);

            this.isEditing = false;
            this.clearingCopy = null;
            this.data.patchCampaign().subscribe(() => {});
          }
        }
      ]
    });

    alert.present();
  }

  async openBackground() {

    const modal = await this.modal.create({
      component: ClearingBackgroundComponent,
      cssClass: 'big-modal',
      backdropDismiss: false
    });

    await modal.present();
  }

  updateNotes(clearing: IClearing, newNotes: string) {
    clearing.notes = newNotes;
    this.data.patchCampaign().subscribe(() => {});
  }

}
