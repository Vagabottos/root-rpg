import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { CampaignGuard } from '../../guards/campaign.guard';
import { CharacterGuard } from '../../guards/character.guard';

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
        canActivate: [AuthGuard]
      },
      {
        path: 'campaigns/view/:id',
        loadChildren: () => import('../campaign-view/view-campaign.module').then( m => m.ViewCampaignPageModule),
        canActivate: [AuthGuard, CampaignGuard]
      },
      {
        path: 'characters/create',
        loadChildren: () => import('../character-create/create-character.module').then( m => m.CreateCharacterPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'characters/view/:id',
        loadChildren: () => import('../character-view/character-view.module').then( m => m.CharacterViewPageModule),
        canActivate: [AuthGuard, CharacterGuard]
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
