import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignViewForestPage } from './campaign-view-forest.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignViewForestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignViewForestPageRoutingModule {}
