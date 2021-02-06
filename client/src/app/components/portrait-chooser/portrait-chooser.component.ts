import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-portrait-chooser',
  templateUrl: './portrait-chooser.component.html',
  styleUrls: ['./portrait-chooser.component.scss'],
})
export class PortraitChooserComponent implements OnInit {

  @Input() selectedPortrait: string;

  constructor(
    private modal: ModalController,
    public content: ContentService
  ) { }

  ngOnInit() {}

  dismiss(portrait?: string) {
    this.modal.dismiss(portrait);
  }

}
