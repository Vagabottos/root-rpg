import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearingViewPage } from './clearing-view.page';

const routes: Routes = [
  {
    path: '',
    component: ClearingViewPage,
    children: [
      {
        path: 'situation',
        loadChildren: () => import('../clearing-view-situation/clearing-view-situation.module').then( m => m.ClearingViewSituationPageModule)
      },
      {
        path: 'events',
        loadChildren: () => import('../clearing-view-events/clearing-view-events.module').then( m => m.ClearingViewEventsPageModule)
      },
      {
        path: 'npcs',
        loadChildren: () => import('../clearing-view-npcs/clearing-view-npcs.module').then( m => m.ClearingViewNpcsPageModule)
      },
      {
        path: '**',
        redirectTo: 'situation',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearingViewPageRoutingModule {}
