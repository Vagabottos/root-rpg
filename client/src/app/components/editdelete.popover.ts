import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-delete-popover',
  template: `
  <ion-content>
    <ion-list>
      <ion-item class="pointer" (click)="dismiss('move')" *ngIf="showMove">
        <ion-icon slot="start" name="swap-horizontal"></ion-icon>
        Move
      </ion-item>
      <ion-item class="pointer" (click)="dismiss('edit')" *ngIf="showEdit">
        <ion-icon slot="start" name="pencil"></ion-icon>
        Edit
      </ion-item>
      <ion-item class="pointer" (click)="dismiss('delete')" *ngIf="showDelete">
        <ion-icon slot="start" name="trash"></ion-icon>
        Delete
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class EditDeletePopoverComponent {
  @Input() public showMove = false;
  @Input() public showEdit = true;
  @Input() public showDelete = true;

  constructor(public popover: PopoverController) {}

  dismiss(choice?: string) {
    this.popover.dismiss(choice);
  }
}
