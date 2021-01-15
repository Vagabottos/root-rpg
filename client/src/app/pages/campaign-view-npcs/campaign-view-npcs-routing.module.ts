import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignViewNpcsPage } from './campaign-view-npcs.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignViewNpcsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignViewNpcsPageRoutingModule {}
