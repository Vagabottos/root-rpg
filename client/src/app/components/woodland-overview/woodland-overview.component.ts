import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICampaign } from '../../../interfaces';

@Component({
  selector: 'app-woodland-overview',
  templateUrl: './woodland-overview.component.html',
  styleUrls: ['./woodland-overview.component.scss'],
})
export class WoodlandOverviewComponent {

  @Input() campaign: ICampaign;

  constructor(
    private modal: ModalController
  ) { }

  dismiss() {
    this.modal.dismiss();
  }

}
