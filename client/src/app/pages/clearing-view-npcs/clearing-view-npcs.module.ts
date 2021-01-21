import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClearingViewNpcsPageRoutingModule } from './clearing-view-npcs-routing.module';

import { ClearingViewNpcsPage } from './clearing-view-npcs.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClearingViewNpcsPageRoutingModule
  ],
  declarations: [ClearingViewNpcsPage]
})
export class ClearingViewNpcsPageModule {}
