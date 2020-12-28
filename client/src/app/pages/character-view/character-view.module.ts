import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewPageRoutingModule } from './character-view-routing.module';

import { CharacterViewPage } from './character-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterViewPageRoutingModule
  ],
  declarations: [CharacterViewPage]
})
export class CharacterViewPageModule {}
