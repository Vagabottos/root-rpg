import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewInfoPage } from './character-view-info.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CharacterViewInfoPageRoutingModule {}
