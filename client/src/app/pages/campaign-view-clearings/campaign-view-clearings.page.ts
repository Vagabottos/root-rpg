import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ICampaign } from '../../../interfaces';
import { WoodlandOverviewComponent } from '../../components/woodland-overview/woodland-overview.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-clearings',
  templateUrl: './campaign-view-clearings.page.html',
  styleUrls: ['./campaign-view-clearings.page.scss'],
})
export class CampaignViewClearingsPage implements OnInit {

  constructor(
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async openWoodlandView(campaign: ICampaign) {

    const modal = await this.modal.create({
      component: WoodlandOverviewComponent,
      componentProps: { campaign },
      cssClass: 'big-modal'
    });

    await modal.present();
  }

}
