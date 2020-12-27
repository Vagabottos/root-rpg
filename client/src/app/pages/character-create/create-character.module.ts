import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCharacterPageRoutingModule } from './create-character-routing.module';

import { CreateCharacterPage } from './create-character.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateCharacterPageRoutingModule
  ],
  declarations: [CreateCharacterPage]
})
export class CreateCharacterPageModule {}
