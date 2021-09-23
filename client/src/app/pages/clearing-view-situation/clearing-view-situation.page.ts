import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

import { merge, cloneDeep } from 'lodash';
import { ICampaign } from '../../../../../shared/interfaces';

import { IClearing } from '../../../interfaces';
import { ClearingBackgroundComponent } from '../../components/clearing-background/clearing-background.component';
import { NPCRandomizerComponent } from '../../components/npc-randomizer/npc-randomizer.component';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-situation',
  templateUrl: './clearing-view-situation.page.html',
  styleUrls: ['./clearing-view-situation.page.scss'],
})
export class ClearingViewSituationPage implements OnInit {

  public isEditing: boolean;
  public campaignCopy: ICampaign;
  public clearingCopy: IClearing;

  constructor(
    private router: Router,
    private alert: AlertController,
    private modal: ModalController,
    private content: ContentService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit(campaign: ICampaign, clearingIdx: number) {
    this.campaignCopy = cloneDeep(campaign);
    this.clearingCopy = this.campaignCopy.clearings[clearingIdx];
    this.isEditing = !this.isEditing;
  }

  private save() {
    this.data.patchCampaign().subscribe(() => {});
  }

  async confirmEdit(clearing: IClearing) {
    const alert = await this.alert.create({
      header: 'Confirm Changes',
      message: `Are you sure you want to make these changes?`,
      buttons: [
        'Cancel',
        {
          text: 'Discard changes',
          handler: () => {
            this.isEditing = false;
          }
        },
        {
          text: 'Yes, confirm',
          handler: () => {
            merge(clearing, this.clearingCopy);

            this.isEditing = false;
            this.clearingCopy = null;
            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  async openBackground() {

    const modal = await this.modal.create({
      component: ClearingBackgroundComponent,
      cssClass: 'big-modal',
      backdropDismiss: false
    });

    await modal.present();
  }

  updateNotes(clearing: IClearing, newNotes: string) {
    clearing.notes = newNotes;
    this.save();
  }

  navigateTo(campaign: ICampaign, clearingId: number): void {
    this.data.setActiveCampaignClearing({ index: clearingId, clearing: campaign.clearings[clearingId] });
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearingId, 'landscape']);
  }

  addConnection(event, campaign: ICampaign, myId: number) {
    const clearingIdx = event.detail.value;
    if (!clearingIdx) { return; }

    campaign.clearings[myId].landscape.clearingConnections.push(clearingIdx);
    campaign.clearings[clearingIdx].landscape.clearingConnections.push(myId);

    event.target.value = null;
  }

  removeConnection(campaign: ICampaign, myId: number, newId: number) {
    campaign.clearings[myId].landscape.clearingConnections = campaign.clearings[myId].landscape.clearingConnections.filter(x => x !== newId);
    campaign.clearings[newId].landscape.clearingConnections = campaign.clearings[newId].landscape.clearingConnections.filter(x => x !== myId);
  }

  getFactionRuleChoices(factionList: string[]): string[] {

    const retFactions = factionList.slice();

    retFactions.unshift('Uncontrolled');

    const marq = retFactions.indexOf('The Marquisate');
    if (marq !== -1) {
      retFactions.splice(marq, 0, 'The Marquisate (Keep)');
    }

    const eyrie = retFactions.indexOf('The Eyrie Dynasties');
    if (eyrie !== -1) {
      retFactions.splice(eyrie, 0, 'The Eyrie Dynasties (Roost)');
    }

    const woodland = retFactions.indexOf('The Woodland Alliance');
    if (woodland !== -1) {
      retFactions.splice(woodland, 0, 'The Woodland Alliance (Base)');
    }

    return retFactions;
  }

  generateProblems(clearing: IClearing) {
    clearing.current.conflicts = this.content.getRandomProblems();
    this.save();
  }

  generateLandmarks(clearing: IClearing) {
    clearing.landscape.landmarks = this.content.getRandomLandmarks();
    this.save();
  }

  async generateNPCs(campaign: ICampaign, clearing: IClearing) {
    const createNPCS = async () => {
      const modal = await this.modal.create({
        component: NPCRandomizerComponent,
        componentProps: { validFactions: campaign.factions, maxNPCs: 15 - clearing.npcs.length },
        cssClass: 'big-modal',
        backdropDismiss: false
      });

      modal.onDidDismiss().then((res) => {
        const resnpcs = res.data;
        if (!resnpcs) { return; }

        clearing.npcs = [];

        clearing.npcs.push(...resnpcs);

        this.save();
      });

      await modal.present();
    };

    if (clearing.npcs.length === 0) {
      createNPCS();
      return;
    }

    const alert = await this.alert.create({
      header: 'Generate NPCs',
      message: `Are you sure you want to generate NPCs? This will reset your existing NPCs.`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, generate',
          handler: () => {
            createNPCS();
          }
        }
      ]
    });

    alert.present();
  }

  navigateToNPCs(campaign: ICampaign, clearingId: number): void {
    if (this.isEditing) {return;}

    this.data.setActiveCampaignClearing({ index: clearingId, clearing: campaign.clearings[clearingId] });
    this.router.navigate(['/dashboard/campaigns/view', campaign._id, 'clearings', clearingId, 'npcs']);
  }

}
