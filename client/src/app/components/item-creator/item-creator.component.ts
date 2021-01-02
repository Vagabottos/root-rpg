import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-creator',
  templateUrl: './item-creator.component.html',
  styleUrls: ['./item-creator.component.scss'],
})
export class ItemCreatorComponent implements OnInit {

  @Input() item: IItem;

  public itemForm = new FormGroup({
    name:       new FormControl('', [Validators.required]),
    wear:       new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10)]),
    itemTags:   new FormControl([]),
    skillTags:  new FormControl([]),
    ranges:     new FormControl([])
  });

  public get boxSlots(): boolean[] {
    return Array(this.itemForm.get('wear').value).fill(false);
  }

  public get formItem(): IItem {
    return {
      name: this.itemForm.get('name').value,
      wear: this.itemForm.get('wear').value,
      tags: this.itemForm.get('itemTags').value,
      skillTags: this.itemForm.get('skillTags').value,
      ranges: this.itemForm.get('ranges').value
    };
  }

  constructor(
    private modal: ModalController,
    public contentService: ContentService,
    public itemService: ItemService
  ) { }

  ngOnInit() {
    if (this.item) {
      this.itemForm.get('name').setValue(this.item.name);
      this.itemForm.get('wear').setValue(this.item.wear);
      this.itemForm.get('itemTags').setValue(this.item.tags || []);
      this.itemForm.get('skillTags').setValue(this.item.skillTags || []);
      this.itemForm.get('ranges').setValue(this.item.ranges || []);
    }
  }

  dismiss(item?: IItem) {
    this.modal.dismiss(item);
  }

  wear(mod: number): void {
    const control = this.itemForm.get('wear');
    control.setValue(control.value + mod);
  }

  addItemTag($event): void {
    const value = $event.detail.value;
    if (!value) { return; }

    $event.target.value = '';
    this.itemForm.get('itemTags').value.push(value);
  }

  removeItemTag(tag: string): void {
    const control = this.itemForm.get('itemTags');
    control.setValue(control.value.filter(x => x !== tag));
  }

  addWeaponTag($event): void {
    const value = $event.detail.value;
    if (!value) { return; }

    $event.target.value = '';
    this.itemForm.get('skillTags').value.push(value);
  }

  removeWeaponTag(tag: string): void {
    const control = this.itemForm.get('skillTags');
    control.setValue(control.value.filter(x => x !== tag));
  }

  addRange($event): void {
    const value = $event.detail.value;
    if (!value) { return; }

    $event.target.value = '';
    this.itemForm.get('ranges').value.push(value);
  }

  removeRange(tag: string): void {
    const control = this.itemForm.get('ranges');
    control.setValue(control.value.filter(x => x !== tag));
  }
}
