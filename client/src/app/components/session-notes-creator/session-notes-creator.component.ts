import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { ISessionNotes } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-session-notes-creator',
  templateUrl: './session-notes-creator.component.html',
  styleUrls: ['./session-notes-creator.component.scss'],
})
export class SessionNotesCreatorComponent implements OnInit {

  @Input() notes: ISessionNotes;

  public notesForm = new FormGroup({
    notesText: new FormControl('', [Validators.required, Validators.maxLength(1000)])
  });

  public get formRecord(): ISessionNotes {
    return {
      ...this.notesForm.value,
      timestamp: this.notes?.timestamp || Date.now()
    };
  }

  constructor(
    private modal: ModalController,
    public contentService: ContentService
  ) { }

  ngOnInit() {
    if (this.notes) {
      this.notesForm.get('notesText').setValue(this.notes.notesText);
    }
  }

  dismiss(visit?: ISessionNotes) {
    this.modal.dismiss(visit);
  }

}
