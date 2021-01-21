import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-landscape',
  templateUrl: './clearing-view-landscape.page.html',
  styleUrls: ['./clearing-view-landscape.page.scss'],
})
export class ClearingViewLandscapePage implements OnInit {

  public isEditing: boolean;

  constructor(
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

}
