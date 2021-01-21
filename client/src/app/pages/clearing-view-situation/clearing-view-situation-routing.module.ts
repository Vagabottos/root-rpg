import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearingViewSituationPage } from './clearing-view-situation.page';

const routes: Routes = [
  {
    path: '',
    component: ClearingViewSituationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearingViewSituationPageRoutingModule {}
