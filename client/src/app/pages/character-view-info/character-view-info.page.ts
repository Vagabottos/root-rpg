import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ICharacterConnection } from '../../../../../shared/interfaces';
import { AdvancementComponent } from '../../components/advancement/advancement.component';
import { BackgroundComponent } from '../../components/background/background.component';
import { CampaignComponent } from '../../components/campaign/campaign.component';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-character-view-info',
  templateUrl: './character-view-info.page.html',
  styleUrls: ['./character-view-info.page.scss'],
})
export class CharacterViewInfoPage implements OnInit {

  constructor(
    private markdown: MarkdownPipe,
    private alert: AlertController,
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

  parseMarkdown(md: string): string {
    return this.markdown.transform(md);
  }

  async viewHTML(title: string, markdown: string) {
    const html = this.parseMarkdown(markdown);

    const alert = await this.alert.create({
      header: title,
      message: html,
      buttons: ['Close'],
      cssClass: 'big-alert'
    });

    alert.present();
  }

  viewConnection(connection: string) {
    const md = this.content.getConnection(connection)?.text;
    this.viewHTML(connection, md);
  }

}
