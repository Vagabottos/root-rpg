import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClearingViewSituationPageRoutingModule } from './clearing-view-situation-routing.module';

import { ClearingViewSituationPage } from './clearing-view-situation.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClearingViewSituationPageRoutingModule
  ],
  declarations: [ClearingViewSituationPage]
})
export class ClearingViewSituationPageModule {}
