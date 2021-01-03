import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewAbilitiesPageRoutingModule } from './character-view-abilities-routing.module';

import { CharacterViewAbilitiesPage } from './character-view-abilities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterViewAbilitiesPageRoutingModule
  ],
  declarations: [CharacterViewAbilitiesPage]
})
export class CharacterViewAbilitiesPageModule {}
