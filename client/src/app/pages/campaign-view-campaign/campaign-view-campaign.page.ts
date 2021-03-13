import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { cloneDeep } from 'lodash';

import { ICampaign } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { SessionNotesCreatorComponent } from '../../components/session-notes-creator/session-notes-creator.component';
import { ISessionNotes } from '../../../../../shared/interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';

@Component({
  selector: 'app-campaign-view-campaign',
  templateUrl: './campaign-view-campaign.page.html',
  styleUrls: ['./campaign-view-campaign.page.scss'],
})
export class CampaignViewCampaignPage implements OnInit {

  constructor(
    private popover: PopoverController,
    private modal: ModalController,
    private alert: AlertController,
    private clipboard: ClipboardService,
    private notification: NotificationService,
    private content: ContentService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addFaction(campaign: ICampaign) {

    const invalidFactions = {};
    campaign.factions.forEach(fact => {
      invalidFactions[fact] = [];

      const add = (msg: string) => invalidFactions[fact].push(msg);

      campaign.npcs.forEach(npc => {
        if (npc.faction !== fact) { return; }
        add(`Unaffiliated NPC: ${npc.name}`);
      });

      campaign.clearings.forEach(clearing => {

        if (clearing.contestedBy === fact) { add(`${clearing.name} Contested`); }
        if (clearing.controlledBy === fact) { add(`${clearing.name} Controlled`); }
        if (clearing.current.dominantFaction === fact) { add(`${clearing.name} Dominant`); }

        clearing.npcs.forEach(npc => {
          if (npc.faction !== fact) { return; }
          add(`${clearing.name} NPC: ${npc.name}`);
        });
      });

      if (invalidFactions[fact].length === 0) { delete invalidFactions[fact]; }
    });

    const modal = await this.notification.loadForcedChoiceModal({
      title: `Choose Factions`,
      message: `Choose factions from the following list to add to your campaign.`,
      choices: this.content
        .getFactions()
        .map(c => ({ name: c.name, text: invalidFactions[c.name] ? `Invalid removal, used in: ${invalidFactions[c.name].join(', ')}` : '' })) || [],
      numChoices: 0,
      bannedChoices: [],
      disableBanned: false,
      disableChoices: Object.keys(invalidFactions) || [],
      defaultSelected: campaign.factions,
      allowCustom: true
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      campaign.factions = data.map(x => x.name);

      this.data.patchCampaign().subscribe(() => {});
    });
  }

  copyID(campaign: ICampaign) {
    this.clipboard.copy(campaign._id);
    this.notification.notify('Copied ID successfully!');
  }

  toggleLock(campaign: ICampaign) {
    campaign.locked = !campaign.locked;
    this.data.patchCampaign().subscribe(() => {});
  }

  updateNotes(campaign: ICampaign, newNotes: string) {
    campaign.notes = newNotes;
    this.data.patchCampaign().subscribe(() => {});
  }

  async renameCampaign(campaign: ICampaign) {
    const alert = await this.alert.create({
      header: 'Rename Campaign',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          placeholder: 'Enter New Campaign Name',
          attributes: {
            value: campaign.name,
            maxLength: 50
          }
        },
      ],
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: (data) => {
            if (!data) {return;}
            const { newName } = data;
            campaign.name = newName;

            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  async addNotes(campaign: ICampaign, notes?: ISessionNotes) {

    const modal = await this.modal.create({
      component: SessionNotesCreatorComponent,
      componentProps: { notes: cloneDeep(notes) }
    });

    modal.onDidDismiss().then((res) => {
      const resvis = res.data;
      if (!resvis) { return; }

      campaign.sessionNotes = campaign.sessionNotes || [];
      const prevIndex = campaign.sessionNotes.findIndex(n => n === notes);

      if (prevIndex === -1) {
        campaign.sessionNotes.unshift(resvis);
      } else {
        campaign.sessionNotes[prevIndex] = resvis;
      }

      this.save();
    });

    await modal.present();
  }

  async attemptDeleteNotes(campaign: ICampaign, notes: ISessionNotes) {
    const alert = await this.alert.create({
      header: 'Delete Session Notes',
      message: `Are you sure you want to delete these session notes? This is permanent and not reversible! It may also screw up your timeline!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            campaign.sessionNotes = campaign.sessionNotes.filter(x => x !== notes);

            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  async showItemEditPopover(campaign: ICampaign, item: ISessionNotes, event) {
    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'edit') {
        this.addNotes(campaign, item);
      }

      if (resAct === 'delete') {
        this.attemptDeleteNotes(campaign, item);
      }
    });

    popover.present();
  }

  private save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
