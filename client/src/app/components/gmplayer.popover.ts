import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-gm-player-popover',
  template: `
  <ion-content>
    <ion-list>
      <ion-item class="pointer" (click)="dismiss('kick')">
        <ion-icon slot="start" name="trash"></ion-icon>
        Kick
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class GMPlayerPopoverComponent {
  constructor(public popover: PopoverController) {}

  dismiss(choice?: string) {
    this.popover.dismiss(choice);
  }
}
