import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewInfoPageRoutingModule } from './character-view-info-routing.module';

import { CharacterViewInfoPage } from './character-view-info.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CharacterViewInfoPageRoutingModule
  ],
  declarations: [CharacterViewInfoPage]
})
export class CharacterViewInfoPageModule {}
