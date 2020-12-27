import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardCampaignsPage } from './dashboard-campaigns.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardCampaignsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCampaignsPageRoutingModule {}
