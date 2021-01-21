import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClearingViewEventsPage } from './clearing-view-events.page';

const routes: Routes = [
  {
    path: '',
    component: ClearingViewEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClearingViewEventsPageRoutingModule {}
