import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClipboardModule } from 'ngx-clipboard';

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
import { NumberWithPlus } from './pipes/number-with-plus';
import { ChangeConnectionsComponent } from './components/change-connections/change-connections.component';
import { ChangeDrivesComponent } from './components/change-drives/change-drives.component';
import { NPCComponent } from './components/npc/npc.component';
import { NPCCreatorComponent } from './components/npc-creator/npc-creator.component';
import { ForestCreatorComponent } from './components/forest-creator/forest-creator.component';
import { ClearingBackgroundComponent } from './components/clearing-background/clearing-background.component';
import { VisitRecordCreatorComponent } from './components/visit-record-creator/visit-record-creator.component';
import { WoodlandOverviewComponent } from './components/woodland-overview/woodland-overview.component';
import { WoodlandMapComponent } from './components/woodland-map/woodland-map.component';
import { DiceRollerComponent } from './components/dice-roller/dice-roller.component';
import { NotesComponent } from './components/notes/notes.component';
import { GMPlayerPopoverComponent } from './components/gmplayer.popover';

const pipes = [MarkdownPipe, NumberWithPlus];
const directives = [LongPressDirective, SwipeDirective];
const components = [ItemComponent, NPCComponent, WoodlandMapComponent, NotesComponent];
const modals = [
  ItemCreatorComponent, EditDeletePopoverComponent, BackgroundComponent, AdvancementComponent,
  CampaignComponent, ForceSelectorComponent, ChangeConnectionsComponent, ChangeDrivesComponent,
  NPCCreatorComponent, ForestCreatorComponent, ClearingBackgroundComponent, VisitRecordCreatorComponent,
  WoodlandOverviewComponent, DiceRollerComponent, GMPlayerPopoverComponent
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
    CommonModule, FormsModule, ReactiveFormsModule, ClipboardModule, IonicModule.forRoot()
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
