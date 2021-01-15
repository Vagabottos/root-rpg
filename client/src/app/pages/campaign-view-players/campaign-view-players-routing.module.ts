import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignViewPlayersPage } from './campaign-view-players.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignViewPlayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignViewPlayersPageRoutingModule {}
