import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
})
export class BackgroundComponent implements OnInit {

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }

}
