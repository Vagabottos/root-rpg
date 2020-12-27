import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCampaignPage } from './create-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCampaignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCampaignPageRoutingModule {}
