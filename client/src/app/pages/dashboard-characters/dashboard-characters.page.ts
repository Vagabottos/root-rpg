import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActionSheetController, AlertController, PopoverController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ICharacter } from '../../../interfaces';
import { EditDeletePopoverComponent } from '../../components/editdelete.popover';
import { CharacterAPIService } from '../../services/character.api.service';

@Component({
  selector: 'app-dashboard-characters',
  templateUrl: './dashboard-characters.page.html',
  styleUrls: ['./dashboard-characters.page.scss'],
})
export class DashboardCharactersPage implements OnInit {

  public characters: ICharacter[];

  private page = 0;

  constructor(
    private router: Router,
    private alert: AlertController,
    private popover: PopoverController,
    private actionSheet: ActionSheetController,
    private characterAPI: CharacterAPIService
  ) { }

  ngOnInit() {
    this.watchRouter();
  }

  private watchRouter() {
    this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((ev: NavigationEnd) => {
      if (!ev.url.endsWith('/characters')) { return; }
      this.loadCharacters(0);
    });
  }

  loadCharacters(page = 0, $event = null): void {
    this.characterAPI.getCharacters(page)
      .subscribe(characters => {
        if ($event) {
          this.characters.push(...characters.data);

          if (this.characters.length >= characters.total) {
            $event.target.disabled = true;
          }

          $event.target.complete();
          return;
        }

        this.characters = characters.data || [];
      });
  }

  loadMoreCharacters($event) {
    this.page += 1;
    this.loadCharacters(this.page, $event);
  }

  async showDeleteActionSheet(char: ICharacter) {
    const actionSheet = await this.actionSheet.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.attemptDeleteCharacter(char);
          }
        }
      ]
    });

    actionSheet.present();
  }

  async showDeletePopover(event, char: ICharacter) {
    event.stopPropagation();
    event.preventDefault();

    const popover = await this.popover.create({
      component: EditDeletePopoverComponent,
      componentProps: { showEdit: false },
      event
    });

    popover.onDidDismiss().then((res) => {
      const resAct = res.data;
      if (!resAct) { return; }

      if (resAct === 'delete') {
        this.attemptDeleteCharacter(char);
      }
    });

    popover.present();
  }

  async attemptDeleteCharacter(char: ICharacter) {
    const alert = await this.alert.create({
      header: 'Delete Character',
      message: `Are you sure you want to delete the character ${char.name}, ${char.archetype}? This is permanent and not reversible!`,
      buttons: [
        'Cancel',
        {
          text: 'Yes, delete',
          handler: () => {
            this.characterAPI.deleteCharacter(char._id).subscribe(() => {
              this.characters = this.characters.filter(c => c._id !== char._id);
            });
          }
        }
      ]
    });

    alert.present();
  }

}
