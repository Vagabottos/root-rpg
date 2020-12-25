import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GmPage } from './gm.page';

const routes: Routes = [
  {
    path: '',
    component: GmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GmPageRoutingModule {}
