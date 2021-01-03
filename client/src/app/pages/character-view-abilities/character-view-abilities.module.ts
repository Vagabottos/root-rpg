import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewAbilitiesPageRoutingModule } from './character-view-abilities-routing.module';

import { CharacterViewAbilitiesPage } from './character-view-abilities.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CharacterViewAbilitiesPageRoutingModule
  ],
  declarations: [CharacterViewAbilitiesPage]
})
export class CharacterViewAbilitiesPageModule {}
