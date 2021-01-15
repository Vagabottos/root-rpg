import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignViewClearingsPage } from './campaign-view-clearings.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignViewClearingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignViewClearingsPageRoutingModule {}
