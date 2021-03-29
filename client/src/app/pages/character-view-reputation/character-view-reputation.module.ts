import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewReputationPageRoutingModule } from './character-view-reputation-routing.module';

import { CharacterViewReputationPage } from './character-view-reputation.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CharacterViewReputationPageRoutingModule
  ],
  declarations: [CharacterViewReputationPage]
})
export class CharacterViewReputationPageModule {}
