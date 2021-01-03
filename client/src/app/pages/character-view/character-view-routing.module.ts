import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterViewPage } from './character-view.page';

const routes: Routes = [
  {
    path: '',
    component: CharacterViewPage,
    children: [
      {
        path: 'info',
        loadChildren: () => import('../character-view-info/character-view-info.module').then( m => m.CharacterViewInfoPageModule)
      },
      {
        path: 'abilities',
        loadChildren: () => import('../character-view-abilities/character-view-abilities.module').then( m => m.CharacterViewAbilitiesPageModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('../character-view-inventory/character-view-inventory.module').then( m => m.CharacterViewInventoryPageModule)
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
export class CharacterViewPageRoutingModule {}
