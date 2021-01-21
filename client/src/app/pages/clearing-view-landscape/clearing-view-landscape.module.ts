import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClearingViewLandscapePageRoutingModule } from './clearing-view-landscape-routing.module';

import { ClearingViewLandscapePage } from './clearing-view-landscape.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClearingViewLandscapePageRoutingModule
  ],
  declarations: [ClearingViewLandscapePage]
})
export class ClearingViewLandscapePageModule {}
