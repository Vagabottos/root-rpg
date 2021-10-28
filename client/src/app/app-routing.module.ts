import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { CampaignGuard } from './guards/campaign.guard';
import { CharacterGuard } from './guards/character.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'password-reset/:token',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'dashboard/campaigns/view/:id/clearings/:clearing',
    loadChildren: () => import('./pages/clearing-view/clearing-view.module').then( m => m.ClearingViewPageModule)
  },
  {
    path: 'dashboard/campaigns/view/:id',
    loadChildren: () => import('./pages/campaign-view/view-campaign.module').then( m => m.ViewCampaignPageModule),
    canActivate: [AuthGuard, CampaignGuard]
  },
  {
    path: 'dashboard/characters/view/:id',
    loadChildren: () => import('./pages/character-view/character-view.module').then( m => m.CharacterViewPageModule),
    canActivate: [AuthGuard, CharacterGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
