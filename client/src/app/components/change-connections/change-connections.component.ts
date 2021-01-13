import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { ICharacterConnection } from '../../../interfaces';
import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-change-connections',
  templateUrl: './change-connections.component.html',
  styleUrls: ['./change-connections.component.scss'],
})
export class ChangeConnectionsComponent implements OnInit, OnDestroy {

  public char$: Subscription;
  public connections: ICharacterConnection[] = [];

  public get unableToSave(): boolean {
    return !this.connections.some(c => !c.target);
  }

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.char$ = this.data.char$.subscribe(char => {
      this.connections = cloneDeep(char.connections);
    });
  }

  ngOnDestroy() {
    this.char$?.unsubscribe();
  }

  dismiss(data?: ICharacterConnection[]) {
    this.modal.dismiss(data);
  }

}
