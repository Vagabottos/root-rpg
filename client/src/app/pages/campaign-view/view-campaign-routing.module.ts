import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCampaignPage } from './view-campaign.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCampaignPage,
    children: [
      {
        path: 'info',
        loadChildren: () => import('../../pages/campaign-view-campaign/campaign-view-campaign.module').then( m => m.CampaignViewCampaignPageModule)
      },
      {
        path: 'clearings',
        loadChildren: () => import('../../pages/campaign-view-clearings/campaign-view-clearings.module').then( m => m.CampaignViewClearingsPageModule)
      },
      {
        path: 'players',
        loadChildren: () => import('../../pages/campaign-view-players/campaign-view-players.module').then( m => m.CampaignViewPlayersPageModule)
      },
      {
        path: 'npcs',
        loadChildren: () => import('../../pages/campaign-view-npcs/campaign-view-npcs.module').then( m => m.CampaignViewNpcsPageModule)
      },
      {
        path: 'forest',
        loadChildren: () => import('../../pages/campaign-view-forest/campaign-view-forest.module').then( m => m.CampaignViewForestPageModule)
      },
      {
        path: '**',
        redirectTo: 'info',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCampaignPageRoutingModule {}
