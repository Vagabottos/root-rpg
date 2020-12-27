import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

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
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/player',
    loadChildren: () => import('./pages/player/player.module').then( m => m.PlayerPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/gm',
    loadChildren: () => import('./pages/gm/gm.module').then( m => m.GmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/campaign/create',
    loadChildren: () => import('./pages/campaign-create/create-campaign.module').then( m => m.CreateCampaignPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/campaign/view/:id',
    loadChildren: () => import('./pages/campaign-view/view-campaign.module').then( m => m.ViewCampaignPageModule)
  },
  {
    path: 'dashboard/character/create',
    loadChildren: () => import('./pages/character-create/create-character.module').then( m => m.CreateCharacterPageModule),
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
