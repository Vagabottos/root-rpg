import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClearingBackgroundComponent } from '../../components/clearing-background/clearing-background.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-situation',
  templateUrl: './clearing-view-situation.page.html',
  styleUrls: ['./clearing-view-situation.page.scss'],
})
export class ClearingViewSituationPage implements OnInit {

  public isEditing: boolean;

  constructor(
    private modal: ModalController,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.data.patchCampaign().subscribe(() => {});
    }
  }

  async openBackground() {

    const modal = await this.modal.create({
      component: ClearingBackgroundComponent
    });

    await modal.present();
  }

}
