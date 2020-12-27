import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCampaignPage } from './view-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCampaignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCampaignPageRoutingModule {}
