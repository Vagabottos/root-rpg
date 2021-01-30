import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { IItem } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { ItemService } from '../../services/item.service';

const SectionVisibility = {
  name:       { all: true },
  load:       { default: true, toolbox: true },
  wear:       { default: true },
  tags:       { all: true },
  weaponTags: { default: true },
  ranges:     { default: true },
  footer:     { default: true, toolbox: true },
};

@Component({
  selector: 'app-item-creator',
  templateUrl: './item-creator.component.html',
  styleUrls: ['./item-creator.component.scss'],
})
export class ItemCreatorComponent implements OnInit {

  @Input() item: IItem;
  @Input() tagSet = 'default';
  @Input() customItemData: any;
  @Input() postProcess: boolean;

  public itemForm = new FormGroup({
    name:         new FormControl('', [Validators.required]),
    wear:         new FormControl(0, [Validators.required, Validators.min(0), Validators.max(10)]),
    load:         new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
    itemTags:     new FormControl([]),
    skillTags:    new FormControl([]),
    ranges:       new FormControl([]),
    designation:  new FormControl('')
  });

  public get allItemTags(): string[] {
    return this.contentService.getTags(this.tagSet);
  }

  public get boxSlots(): boolean[] {
    return Array(this.itemForm.get('wear').value).fill(false);
  }

  public get formItem(): IItem {
    return {
      name: this.itemForm.get('name').value,
      wear: this.itemForm.get('wear').value,
      tags: this.itemForm.get('itemTags').value,
      skillTags: this.itemForm.get('skillTags').value,
      ranges: this.itemForm.get('ranges').value,
      designation: this.itemForm.get('designation').value,
      extraValue: this.item?.extraValue,
      extraLoad: this.itemForm.get('load').value,
      tagSet: this.customItemData?.tagSet
    };
  }

  constructor(
    private alert: AlertController,
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
      this.itemForm.get('designation').setValue(this.item.designation ?? '');
      this.itemForm.get('load').setValue(this.item.extraLoad ?? 1);

      if (this.item.tagSet) {
        this.tagSet = this.item.tagSet;
      }
    }

    if (this.customItemData) {
      this.itemForm.get('name').setValue(this.customItemData.name);
      this.itemForm.get('load').setValue(this.customItemData.extraLoad ?? 1);
      this.itemForm.get('wear').setValue(this.customItemData.wear ?? 1);
      this.tagSet = this.customItemData.tagSet;
    }
  }

  dismiss(item?: IItem) {
    if (item && this.postProcess) {
      item.extraValue = 0;
      if (item.tags?.includes('Luxury')) { item.extraValue = 3; }
    }

    this.modal.dismiss(item);
  }

  canSee(section: string): boolean {
    return SectionVisibility[section].all || SectionVisibility[section][this.tagSet];
  }

  wear(mod: number): void {
    const control = this.itemForm.get('wear');
    control.setValue(control.value + mod);
  }

  async addItemTag($event) {
    const value = $event.detail.value;
    if (!value) { return; }

    $event.target.value = '';
    this.itemForm.get('itemTags').value.push(value);

    const tag = this.contentService.getTag(value);
    if (tag?.input) {
      const alert = await this.alert.create({
        header: 'Ceremonial Item',
        message: 'Enter the faction you want this item to be special for.',
        backdropDismiss: false,
        inputs: [
          {
            name: 'designation',
            type: 'text',
            placeholder: 'Enter Faction',
            attributes: {
              maxLength: 50
            }
          },
        ],
        buttons: [
          {
            text: 'Confirm',
            handler: (data) => {
              this.itemForm.get('designation').setValue(data?.designation);
            }
          }
        ]
      });

      alert.present();
    }
  }

  removeItemTag(tag: string): void {
    const control = this.itemForm.get('itemTags');
    control.setValue(control.value.filter(x => x !== tag));

    if (tag === 'Ceremonial') {
      this.itemForm.get('designation').setValue('');
    }
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
