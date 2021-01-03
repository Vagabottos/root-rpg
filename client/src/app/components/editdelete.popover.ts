import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-edit-delete-popover',
  template: `
  <ion-content>
    <ion-list>
      <ion-item (click)="dismiss('edit')">
        <ion-icon slot="start" name="pencil"></ion-icon>
        Edit
      </ion-item>
      <ion-item (click)="dismiss('delete')">
        <ion-icon slot="start" name="trash"></ion-icon>
        Delete
      </ion-item>
    </ion-list>
  </ion-content>
  `,
  styles: [
    ``
  ]
})
export class EditDeletePopoverComponent {
  constructor(public popover: PopoverController) {}

  dismiss(choice?: string) {
    this.popover.dismiss(choice);
  }
}
