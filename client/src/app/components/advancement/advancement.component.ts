import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-advancement',
  templateUrl: './advancement.component.html',
  styleUrls: ['./advancement.component.scss'],
})
export class AdvancementComponent implements OnInit {

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
