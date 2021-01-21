import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearingViewLandscapePage } from './clearing-view-landscape.page';

const routes: Routes = [
  {
    path: '',
    component: ClearingViewLandscapePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearingViewLandscapePageRoutingModule {}
