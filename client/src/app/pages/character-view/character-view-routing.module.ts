import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewPage } from './character-view.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterViewPageRoutingModule {}
