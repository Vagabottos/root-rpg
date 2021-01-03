import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewAbilitiesPage } from './character-view-abilities.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewAbilitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterViewAbilitiesPageRoutingModule {}
