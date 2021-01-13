import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-change-drives',
  templateUrl: './change-drives.component.html',
  styleUrls: ['./change-drives.component.scss'],
})
export class ChangeDrivesComponent implements OnInit, OnDestroy {

  public char$: Subscription;
  public drives: Record<string, boolean> = {};
  public driveTargets: Record<string, string> = {};

  public get canSave(): boolean {
    return Object.keys(this.drives)
              .filter(x => this.drives[x])
              .filter(x => this.content.getDrive(x)?.namedTarget ? this.driveTargets[x] : true)
              .length === 2;
  }

  public get canSelectMore(): boolean {
    return Object.keys(this.drives)
              .filter(x => this.drives[x]).length < 2;
  }

  public get driveData() {
    return {
      drives: Object.keys(this.drives).filter(x => this.drives[x]),
      driveTargets: this.driveTargets
    };
  }

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
    this.char$ = this.data.char$.subscribe(char => {
      char.drives.forEach(drive => {
        this.drives[drive] = true;
      });

      this.driveTargets = cloneDeep(char.driveTargets || {});
    });
  }

  ngOnDestroy() {
    this.char$?.unsubscribe();
  }

  dismiss(data?: any) {
    this.modal.dismiss(data);
  }

}
