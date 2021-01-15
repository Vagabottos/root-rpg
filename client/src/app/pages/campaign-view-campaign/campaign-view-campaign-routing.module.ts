import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignViewCampaignPage } from './campaign-view-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignViewCampaignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignViewCampaignPageRoutingModule {}
