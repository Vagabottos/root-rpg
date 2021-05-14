import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICampaign } from '../../../../../shared/interfaces';

@Component({
  selector: 'app-campaign-log',
  templateUrl: './campaign-log.component.html',
  styleUrls: ['./campaign-log.component.scss'],
})
export class CampaignLogComponent {

  @Input() campaign: ICampaign;

  constructor(
    private modal: ModalController,
  ) { }

  dismiss() {
    this.modal.dismiss();
  }

}
