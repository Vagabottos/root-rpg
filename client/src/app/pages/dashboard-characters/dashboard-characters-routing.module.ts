import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardCharactersPage } from './dashboard-characters.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardCharactersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCharactersPageRoutingModule {}
