import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CharacterViewInventoryPageRoutingModule } from './character-view-inventory-routing.module';

import { CharacterViewInventoryPage } from './character-view-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CharacterViewInventoryPageRoutingModule
  ],
  declarations: [CharacterViewInventoryPage]
})
export class CharacterViewInventoryPageModule {}
