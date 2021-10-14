import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { IForest } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-forest-creator',
  templateUrl: './forest-creator.component.html',
  styleUrls: ['./forest-creator.component.scss'],
})
export class ForestCreatorComponent implements OnInit {

  @Input() forest: IForest;

  public position;

  public forestForm = new FormGroup({
    name:         new FormControl('', [Validators.required, Validators.maxLength(50)]),
    location:     new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    details:      new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    type:         new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  public get formForest(): IForest {
    return {
      name: this.forestForm.get('name').value,
      location: this.forestForm.get('location').value,
      details: this.forestForm.get('details').value,
      type: this.forestForm.get('type').value,
      position: this.position
    };
  }

  constructor(
    private modal: ModalController,
    public contentService: ContentService
  ) { }

  pickRandomName() {
    this.forestForm.get('name').setValue(this.contentService.getRandomForestName());
  }

  ngOnInit() {
    if (this.forest) {
      this.position = this.forest.position;
      this.forestForm.get('name').setValue(this.forest.name);
      this.forestForm.get('location').setValue(this.forest.location);
      this.forestForm.get('details').setValue(this.forest.details);
      this.forestForm.get('type').setValue(this.forest.type);
    }
  }

  dismiss(forest?: IForest) {
    this.modal.dismiss(forest);
  }

}
