import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewReputationPage } from './character-view-reputation.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewReputationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterViewReputationPageRoutingModule {}
