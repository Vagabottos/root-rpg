import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClearingViewPageRoutingModule } from './clearing-view-routing.module';

import { ClearingViewPage } from './clearing-view.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClearingViewPageRoutingModule
  ],
  declarations: [ClearingViewPage]
})
export class ClearingViewPageModule {}
