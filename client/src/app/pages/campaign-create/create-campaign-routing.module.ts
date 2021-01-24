import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnsavedChangesGuard } from '../../guards/confirm-leave.guard';

import { CreateCampaignPage } from './create-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCampaignPage,
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCampaignPageRoutingModule {}
