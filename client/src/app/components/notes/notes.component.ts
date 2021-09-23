
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {

  @Input() notes: string;
  @Output() updateNotes: EventEmitter<string> = new EventEmitter();

  @ViewChild(IonTextarea) notesElement: IonTextarea;

  public isEditing: boolean;

  constructor(
  ) { }

  ngOnInit() {
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.notesElement.setFocus();
    }

    if (!this.isEditing) {
      this.updateNotes.emit(this.notes);
    }
  }

  unfocus() {
    if (!this.isEditing) {return;}
    this.toggleEditing();
  }

}
