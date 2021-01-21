import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { cloneDeep } from 'lodash';

import { ICampaign, IForest } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { ForestCreatorComponent } from '../../components/forest-creator/forest-creator.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-campaign-view-forest',
  templateUrl: './campaign-view-forest.page.html',
  styleUrls: ['./campaign-view-forest.page.scss'],
})
export class CampaignViewForestPage implements OnInit {

  constructor(
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private popover: PopoverController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  async addNewForest(campaign: ICampaign, forest?: IForest) {

    const modal = await this.modal.create({
      component: ForestCreatorComponent,
      componentProps: { forest: cloneDeep(forest) }
    });

    modal.onDidDismiss().then((res) => {
      const resforest = res.data;
      if (!resforest) { return; }

      campaign.forests = campaign.forests || [];
      const prevIndex = campaign.forests.findIndex(n => n === forest);

      if (prevIndex === -1) {
        campaign.forests.push(resforest);
      } else {
        campaign.forests[prevIndex] = resforest;
      }

      this.save();
    });

    await modal.present();
  }

  async showDeleteActionSheet(camp: ICampaign, forest: IForest) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.addNewForest(camp, forest);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptDeleteForest(camp, forest);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showDeletePopover(event, camp: ICampaign, forest: IForest) {
    event.stopPropagation();
    event.preventDefault();

    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'edit') {
        this.addNewForest(camp, forest);
      }

      if (resAct === 'delete') {
        this.attemptDeleteForest(camp, forest);
      }
    });

    popover.present();
  }

  async attemptDeleteForest(campaign: ICampaign, forest: IForest) {
    const alert = await this.alert.create({
      header: 'Delete Forest',
      message: `Are you sure you want to delete the forest ${forest.name}? This is permanent and not reversible!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            campaign.forests = campaign.forests.filter(x => x !== forest);

            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  public save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
