import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ICharacter } from '../../../interfaces';
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

  private save(): void {
    this.data.patchCharacter();
  }

  // reputation functions
  getNotoriety(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.notoriety ?? 0;
  }

  getPrestige(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.prestige ?? 0;
  }

  // stat functions
  getStatTotal(character: ICharacter, stat: string): number {
    const base = character.stats[stat];
    const bonus = character.moves.reduce((prev, cur) => prev + (this.content.getMove(cur)?.addStat?.[stat] ?? 0), 0);
    return base + bonus;
  }

  // harm functions
  adjustHarm(character: ICharacter, harm: string, newValue: number): void {
    if (character[harm.toLowerCase()] === newValue) {
      character[harm.toLowerCase()] = 0;
      this.save();
      return;
    }

    character[harm.toLowerCase()] = newValue;
    this.save();
  }

  // connection functions
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
