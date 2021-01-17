import { Component, Input, OnInit } from '@angular/core';
import { AlertController, IonCheckbox, ModalController } from '@ionic/angular';

import { difference } from 'lodash';

@Component({
  selector: 'app-force-selector',
  templateUrl: './force-selector.component.html',
  styleUrls: ['./force-selector.component.scss'],
})
export class ForceSelectorComponent implements OnInit {

  @Input() public title: string;
  @Input() public message: string;
  @Input() public numChoices = 1;
  @Input() public choices: Array<{ name: string, text: string }> = [];
  @Input() public bannedChoices: string[] = [];
  @Input() public disableBanned = false;
  @Input() public defaultSelected: string[] = [];
  @Input() public allowCustom: boolean;

  public selected: boolean[] = [];

  public get numSelected(): number {
    return this.selected.filter(Boolean).length;
  }

  public get formattedSelected(): Array<{ name: string, text: string }> {
    return this.choices.filter((x, i) => this.selected[i]);
  }

  constructor(
    private alert: AlertController,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.selected = this.choices.map(({ name }) => (this.defaultSelected || []).includes(name));
    const extraChoices = difference(this.defaultSelected, this.choices.map(x => x.name));
    extraChoices.forEach(name => {
      this.choices.push({ name, text: '' });
      this.selected.push(true);
    });
  }

  selectItem(checkbox: IonCheckbox, index: number): void {
    this.selected[index] = checkbox.checked;
  }

  dismiss(choices?: Array<{ name: string, text: string }>) {
    this.modal.dismiss(choices);
  }

  async addCustom() {
    const alert = await this.alert.create({
      header: 'Add Custom Choice',
      inputs: [
        {
          name: 'customChoice',
          type: 'text',
          placeholder: 'Enter Custom Choice'
        },
      ],
      buttons: [
        'Cancel',
        {
          text: 'Confirm',
          handler: (data) => {
            this.choices.push({ name: data?.customChoice, text: '' });
            this.selected.push(true);
          }
        }
      ]
    });

    alert.present();
  }

}
