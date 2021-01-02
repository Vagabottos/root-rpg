import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCharacterPageRoutingModule } from './create-character-routing.module';

import { CreateCharacterPage } from './create-character.page';
import { SharedModule } from '../../shared.module';
import { ItemEditPopoverComponent } from './item.popover';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    CreateCharacterPageRoutingModule
  ],
  declarations: [CreateCharacterPage, ItemEditPopoverComponent],
  entryComponents: [ItemEditPopoverComponent]
})
export class CreateCharacterPageModule {}
