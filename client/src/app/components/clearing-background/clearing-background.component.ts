import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { cloneDeep, merge } from 'lodash';

import { IClearing } from '../../../interfaces';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-background',
  templateUrl: './clearing-background.component.html',
  styleUrls: ['./clearing-background.component.scss'],
})
export class ClearingBackgroundComponent implements OnInit, OnDestroy {

  public isEditing: boolean;
  public clearingCopy: IClearing;

  constructor(
    private alert: AlertController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  toggleEdit(clearing: IClearing) {
    this.clearingCopy = cloneDeep(clearing);
    this.isEditing = !this.isEditing;
  }

  async confirmEdit(clearing: IClearing) {
    const alert = await this.alert.create({
      header: 'Confirm Changes',
      message: `Are you sure you want to make these history changes?`,
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
            this.dismiss();
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
