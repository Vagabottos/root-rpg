import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReferenceComponent } from './components/reference/reference.component';
import { UserAPIService } from './services/user.api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private modal: ModalController,
    public user: UserAPIService
  ) {}

  async openReference() {
    const bg = await this.modal.create({
      component: ReferenceComponent,
      cssClass: 'big-modal'
    });

    bg.present();
  }

}
