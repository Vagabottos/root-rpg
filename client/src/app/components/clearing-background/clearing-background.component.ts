import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CampaignAPIService } from '../../services/campaign.api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-background',
  templateUrl: './clearing-background.component.html',
  styleUrls: ['./clearing-background.component.scss'],
})
export class ClearingBackgroundComponent implements OnInit, OnDestroy {

  public isEditing: boolean;

  constructor(
    private modal: ModalController,
    private campaignAPI: CampaignAPIService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.data.patchCampaign().subscribe(() => {});
    }
  }

  dismiss() {
    this.modal.dismiss();
  }

}
