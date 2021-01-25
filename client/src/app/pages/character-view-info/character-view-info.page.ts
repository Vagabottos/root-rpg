import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { clamp } from 'lodash';

import { ICharacter } from '../../../interfaces';
import { AdvancementComponent } from '../../components/advancement/advancement.component';
import { BackgroundComponent } from '../../components/background/background.component';
import { CampaignComponent } from '../../components/campaign/campaign.component';
import { ChangeConnectionsComponent } from '../../components/change-connections/change-connections.component';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { CharacterHelperService } from '../../services/character.helper.service';
import { NotificationService } from '../../services/notification.service';
import { PDFService } from '../../services/pdf.service';

@Component({
  selector: 'app-character-view-info',
  templateUrl: './character-view-info.page.html',
  styleUrls: ['./character-view-info.page.scss'],
})
export class CharacterViewInfoPage implements OnInit {

  constructor(
    private markdown: MarkdownPipe,
    public notification: NotificationService,
    private alert: AlertController,
    private modal: ModalController,
    public data: DataService,
    public content: ContentService,
    public pdf: PDFService,
    public characterHelper: CharacterHelperService
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
    this.data.patchCharacter().subscribe(() => {});
  }

  // reputation functions
  getNotoriety(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.notoriety ?? 0;
  }

  getPrestige(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.prestige ?? 0;
  }

  setNotoriety(character: ICharacter, faction: string, value: number): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].notoriety = value;

    if (character.reputation[faction].notoriety >= 3) {
      this.lowerNotoriety(character, faction);
    }

    this.save();
  }

  setPrestige(character: ICharacter, faction: string, value: number): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].prestige = value;

    if (character.reputation[faction].prestige >= 5) {
      this.increasePrestige(character, faction);
    }

    this.save();
  }

  lowerNotoriety(character: ICharacter, faction: string): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].total = character.reputation[faction].total || 0;

    character.reputation[faction].total = clamp(character.reputation[faction].total - 1, -3, 3);
    character.reputation[faction].notoriety = 0;

    this.save();
  }

  increasePrestige(character: ICharacter, faction: string): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].total = character.reputation[faction].total || 0;

    character.reputation[faction].total = clamp(character.reputation[faction].total + 1, -3, 3);
    character.reputation[faction].prestige = 0;

    this.save();
  }

  adjustHarm(character: ICharacter, harm: string, newValue: number): void {
    if (!character.harm) { character.harm = { injury: 0, depletion: 0, exhaustion: 0 }; }

    if (character.harm[harm.toLowerCase()] === newValue) {
      character.harm[harm.toLowerCase()] = 0;
      this.save();
      return;
    }

    character.harm[harm.toLowerCase()] = newValue;
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

  async changeConnections(character: ICharacter) {
    const modal = await this.modal.create({
      component: ChangeConnectionsComponent
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      character.connections = data;
      this.save();
    });

    modal.present();
  }

  async changeFactions(character: ICharacter) {

    const modal = await this.notification.loadForcedChoiceModal({
      title: `Choose Factions`,
      message: `Choose factions from the following list to track reputation for.`,
      choices: this.content.getFactions().map(c => ({ name: c.name, text: '' })) || [],
      numChoices: 0,
      bannedChoices: [],
      disableBanned: false,
      defaultSelected: Object.keys(character.reputation),
      allowCustom: true
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      const reputationCopy = character.reputation;
      character.reputation = {};

      data.forEach(({ name }) => {
        if (reputationCopy[name]) {
          character.reputation[name] = reputationCopy[name];
          return;
        }

        character.reputation[name] = { notoriety: 0, prestige: 0, total: 0 };
      });

      this.data.patchCharacter().subscribe(() => {});
    });
  }

}
