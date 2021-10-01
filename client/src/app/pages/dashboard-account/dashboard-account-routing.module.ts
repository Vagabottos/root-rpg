import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardAccountPage } from './dashboard-account.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardAccountPageRoutingModule {}
