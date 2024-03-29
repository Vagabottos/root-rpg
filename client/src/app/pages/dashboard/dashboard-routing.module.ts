import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'account',
        loadChildren: () => import('../dashboard-account/dashboard-account.module').then( m => m.DashboardAccountPageModule)
      },
      {
        path: 'characters',
        loadChildren: () => import('../dashboard-characters/dashboard-characters.module').then( m => m.DashboardCharactersPageModule)
      },
      {
        path: 'campaigns',
        loadChildren: () => import('../dashboard-campaigns/dashboard-campaigns.module').then( m => m.DashboardCampaignsPageModule)
      },
      {
        path: 'campaigns/create',
        loadChildren: () => import('../campaign-create/create-campaign.module').then( m => m.CreateCampaignPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'characters/create',
        loadChildren: () => import('../character-create/create-character.module').then( m => m.CreateCharacterPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: 'characters',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
