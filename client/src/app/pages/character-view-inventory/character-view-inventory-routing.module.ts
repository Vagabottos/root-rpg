import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewInventoryPage } from './character-view-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterViewInventoryPageRoutingModule {}
