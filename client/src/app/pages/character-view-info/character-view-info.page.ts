import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BackgroundComponent } from '../../components/background/background.component';
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

}
