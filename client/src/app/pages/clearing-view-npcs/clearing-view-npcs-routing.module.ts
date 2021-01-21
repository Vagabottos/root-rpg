import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearingViewNpcsPage } from './clearing-view-npcs.page';

const routes: Routes = [
  {
    path: '',
    component: ClearingViewNpcsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearingViewNpcsPageRoutingModule {}
