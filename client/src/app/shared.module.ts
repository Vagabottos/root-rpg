import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemCreatorComponent } from './components/item-creator/item-creator.component';
import { ItemComponent } from './components/item/item.component';
import { EditDeletePopoverComponent } from './components/editdelete.popover';
import { BackgroundComponent } from './components/background/background.component';

import { LongPressDirective } from './directives/longpress.directive';

import { MarkdownPipe } from './pipes/markdown.pipe';
import { AdvancementComponent } from './components/advancement/advancement.component';
import { CampaignComponent } from './components/campaign/campaign.component';

@NgModule({
  declarations: [
    MarkdownPipe, LongPressDirective, ItemComponent, ItemCreatorComponent, EditDeletePopoverComponent,
    BackgroundComponent, AdvancementComponent, CampaignComponent
  ],
  entryComponents: [
    ItemCreatorComponent, EditDeletePopoverComponent, BackgroundComponent, AdvancementComponent, 
    CampaignComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [],
  exports: [
    MarkdownPipe, LongPressDirective, ItemComponent, ItemCreatorComponent, EditDeletePopoverComponent
  ]
})
export class SharedModule {}
