import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { UnsavedChangesGuard } from '../../guards/confirm-leave.guard';

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
      {
        path: 'campaigns/create',
        loadChildren: () => import('../campaign-create/create-campaign.module').then( m => m.CreateCampaignPageModule),
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'characters/create',
        loadChildren: () => import('../character-create/create-character.module').then( m => m.CreateCharacterPageModule),
        canActivate: [AuthGuard],
        canDeactivate: [UnsavedChangesGuard]
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
