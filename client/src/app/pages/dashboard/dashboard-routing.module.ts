import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'characters',
        loadChildren: () => import('../dashboard-characters/dashboard-characters.module').then( m => m.DashboardCharactersPageModule)
      },
      {
        path: 'campaigns',
        loadChildren: () => import('../dashboard-campaigns/dashboard-campaigns.module').then( m => m.DashboardCampaignsPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
