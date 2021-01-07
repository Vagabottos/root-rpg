import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ItemCreatorComponent } from './components/item-creator/item-creator.component';
import { ItemComponent } from './components/item/item.component';
import { EditDeletePopoverComponent } from './components/editdelete.popover';
import { BackgroundComponent } from './components/background/background.component';

import { LongPressDirective } from './directives/longpress.directive';
import { SwipeDirective } from './directives/swipe.directive';

import { MarkdownPipe } from './pipes/markdown.pipe';
import { AdvancementComponent } from './components/advancement/advancement.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { ForceSelectorComponent } from './components/force-selector/force-selector.component';

const pipes = [MarkdownPipe];
const directives = [LongPressDirective, SwipeDirective];
const components = [ItemComponent];
const modals = [
  ItemCreatorComponent, EditDeletePopoverComponent, BackgroundComponent, AdvancementComponent,
  CampaignComponent, ForceSelectorComponent
];

@NgModule({
  declarations: [
    ...pipes,
    ...directives,
    ...modals,
    ...components
  ],
  entryComponents: [
    ...modals
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()
  ],
  providers: [MarkdownPipe],
  bootstrap: [],
  exports: [
    ...pipes,
    ...directives,
    ...modals,
    ...components
  ]
})
export class SharedModule {}
