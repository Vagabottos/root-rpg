import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdvancementComponent } from '../../components/advancement/advancement.component';
import { BackgroundComponent } from '../../components/background/background.component';
import { CampaignComponent } from '../../components/campaign/campaign.component';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-character-view-info',
  templateUrl: './character-view-info.page.html',
  styleUrls: ['./character-view-info.page.scss'],
})
export class CharacterViewInfoPage implements OnInit {

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
  }

  async openBackground() {
    const bg = await this.modal.create({
      component: BackgroundComponent
    });
    
    bg.present();
  }

  async openCampaign() {
    const bg = await this.modal.create({
      component: CampaignComponent
    });
    
    bg.present();
  }

  async openAdvancement() {
    const bg = await this.modal.create({
      component: AdvancementComponent
    });
    
    bg.present();
  }

}
