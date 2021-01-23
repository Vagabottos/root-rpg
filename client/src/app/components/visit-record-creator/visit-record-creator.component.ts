import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { IClearingVisitedEvent } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-visit-record-creator',
  templateUrl: './visit-record-creator.component.html',
  styleUrls: ['./visit-record-creator.component.scss'],
})
export class VisitRecordCreatorComponent implements OnInit {

  @Input() visitRecord: IClearingVisitedEvent;

  public visitForm = new FormGroup({
    visitText:         new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    warContinuesText:  new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    warContinuesType:  new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  public get formRecord(): IClearingVisitedEvent {
    return {
      ...this.visitForm.value,
      timestamp: this.visitRecord?.timestamp || Date.now()
    };
  }

  constructor(
    private modal: ModalController,
    public contentService: ContentService
  ) { }

  ngOnInit() {
    if (this.visitRecord) {
      this.visitForm.get('visitText').setValue(this.visitRecord.visitText);
      this.visitForm.get('warContinuesText').setValue(this.visitRecord.warContinuesText);
      this.visitForm.get('warContinuesType').setValue(this.visitRecord.warContinuesType);
    }
  }

  dismiss(visit?: IClearingVisitedEvent) {
    this.modal.dismiss(visit);
  }

}
