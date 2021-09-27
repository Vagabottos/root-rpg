import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

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
import { ChangeDrivesComponent } from '../../components/change-drives/change-drives.component';

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

  adjustHarm(character: ICharacter, harm: string, newValue: number): void {
    if (!character.harm) { character.harm = { injury: 0, depletion: 0, exhaustion: 0, diplomat: 0, legacy: 0 }; }

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

  updateNotes(character: ICharacter, newNotes: string) {
    character.notes = newNotes;
    this.data.patchCharacter().subscribe(() => {});
  }

  async changeNature(character: ICharacter): Promise<void> {
    const natures = this.content.getVagabond(character.archetype).natures
      .map(({ name }) => ({ name, text: this.content.getNature(name)?.text }));

    const modal = await this.notification.loadForcedChoiceModal({
      title: `Change Nature`,
      message: '',
      choices: natures,
      numChoices: 1
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      const { name } = data[0];
      character.nature = name;

      this.data.patchCharacter().subscribe(() => {});
    });

  }

  async changeDrives(character: ICharacter): Promise<void> {
    const modal = await this.modal.create({
      component: ChangeDrivesComponent
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      const { drives, driveTargets } = data;
      character.drives = drives;
      character.driveTargets = driveTargets;

      this.data.patchCharacter().subscribe(() => {});
    });

    modal.present();
  }
}
