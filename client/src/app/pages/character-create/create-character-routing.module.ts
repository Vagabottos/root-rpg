import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnsavedChangesGuard } from '../../guards/confirm-leave.guard';

import { CreateCharacterPage } from './create-character.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCharacterPage,
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCharacterPageRoutingModule {}
