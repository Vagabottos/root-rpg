import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCharacterPage } from './create-character.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCharacterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCharacterPageRoutingModule {}
