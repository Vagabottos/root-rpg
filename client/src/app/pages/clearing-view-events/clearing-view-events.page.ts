import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, PopoverController } from '@ionic/angular';

import { cloneDeep, merge } from 'lodash';

import { IClearing, IClearingVisitedEvent } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { VisitRecordCreatorComponent } from '../../components/visit-record-creator/visit-record-creator.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-events',
  templateUrl: './clearing-view-events.page.html',
  styleUrls: ['./clearing-view-events.page.scss'],
})
export class ClearingViewEventsPage implements OnInit {

  public isEditing: boolean;
  public clearingCopy: IClearing;

  constructor(
    private actionSheet: ActionSheetController,
    private alert: AlertController,
    private popover: PopoverController,
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit(clearing: IClearing) {
    this.clearingCopy = cloneDeep(clearing);
    this.isEditing = !this.isEditing;
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

  async addNewVisitRecord(clearing: IClearing, visit?: IClearingVisitedEvent) {

    const modal = await this.modal.create({
      component: VisitRecordCreatorComponent,
      componentProps: { visitRecord: cloneDeep(visit) }
    });

    modal.onDidDismiss().then((res) => {
      const resvis = res.data;
      if (!resvis) { return; }

      clearing.eventRecord.visited = clearing.eventRecord.visited || [];
      const prevIndex = clearing.eventRecord.visited.findIndex(n => n === visit);

      if (prevIndex === -1) {
        clearing.eventRecord.visited.push(resvis);
      } else {
        clearing.eventRecord.visited[prevIndex] = resvis;
      }

      this.save();
    });

    await modal.present();

  }

  async showDeleteActionSheet(clearing: IClearing, visit: IClearingVisitedEvent) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'pencil',
          handler: () => {
            this.addNewVisitRecord(clearing, visit);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptDeleteVisitRecord(clearing, visit);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showDeletePopover(event, clearing: IClearing, visit: IClearingVisitedEvent) {
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
        this.addNewVisitRecord(clearing, visit);
      }

      if (resAct === 'delete') {
        this.attemptDeleteVisitRecord(clearing, visit);
      }
    });

    popover.present();
  }

  async attemptDeleteVisitRecord(clearing: IClearing, visit: IClearingVisitedEvent) {
    const alert = await this.alert.create({
      header: 'Delete Visit Record',
      message: `Are you sure you want to delete this visit record? This is permanent and not reversible! It may also screw up your timeline!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            clearing.eventRecord.visited = clearing.eventRecord.visited.filter(x => x !== visit);

            this.save();
          }
        }
      ]
    });

    alert.present();
  }

  private save() {
    this.data.patchCampaign().subscribe(() => {});
  }

}
