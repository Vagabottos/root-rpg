import { Component, OnInit } from '@angular/core';
import { clamp } from 'lodash';
import { ICharacter } from '../../../interfaces';
import { ContentService } from '../../services/content.service';

import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-character-view-reputation',
  templateUrl: './character-view-reputation.page.html',
  styleUrls: ['./character-view-reputation.page.scss'],
})
export class CharacterViewReputationPage implements OnInit {

  public readonly reputationBackgrounds = {
    Denizens: 'denizens',
    'The Marquisate': 'marquise',
    'The Eyrie Dynasties': 'eyrie',
    'The Woodland Alliance': 'woodland',
    'The Lizard Cult': 'cult',
    'The Riverfolk Company': 'riverfolk',
    'The Underground Duchy': 'duchy',
    'The Corvid Conspiracy': 'conspiracy'
  };

  constructor(
    // private popover: PopoverController,
    // private actionSheet: ActionSheetController,
    // private modal: ModalController,
    private notification: NotificationService,
    private content: ContentService,
    public data: DataService
  ) {}

  ngOnInit() {
  }

  async changeFactions(character: ICharacter) {

    const modal = await this.notification.loadForcedChoiceModal({
      title: `Choose Factions`,
      message: `Choose factions from the following list to track reputation for.`,
      choices: this.content.getFactions().map(c => ({ name: c.name, text: '' })) || [],
      numChoices: 0,
      bannedChoices: [],
      disableBanned: false,
      defaultSelected: Object.keys(character.reputation),
      allowCustom: true
    });

    modal.onDidDismiss().then(({ data }) => {
      if (!data) { return; }

      const reputationCopy = character.reputation;
      character.reputation = {};

      data.forEach(({ name }) => {
        if (reputationCopy[name]) {
          character.reputation[name] = reputationCopy[name];
          return;
        }

        character.reputation[name] = { notoriety: 0, prestige: 0, total: 0 };
      });

      this.save();
    });
  }

  getNotoriety(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.notoriety ?? 0;
  }

  getPrestige(character: ICharacter, faction: string): number {
    return character.reputation[faction]?.prestige ?? 0;
  }

  getLowerFactionTotal(character: ICharacter, faction: string): number|string {
    const newValue = (character.reputation[faction]?.total || 0) - 1;
    if (newValue <= -4) { return '---'; }
    return Math.max(-3, newValue);
  }

  getHigherFactionTotal(character: ICharacter, faction: string): number|string {
    const newValue = (character.reputation[faction]?.total || 0) + 1;
    if (newValue >= 4) { return '---'; }
    return Math.min(3, newValue);
  }

  getNotorietyBoxes(character: ICharacter, faction: string): number[] {
    if (character.reputation[faction]?.total === -1) { return [0, 1, 2, null, 3, 4, 5]; }
    if (character.reputation[faction]?.total <= -2)  { return [0, 1, 2, null, 3, 4, 5, null, 6, 7, 8]; }

    return [0, 1, 2];
  }

  getPrestigeBoxes(character: ICharacter, faction: string): number[] {
    if (character.reputation[faction]?.total === 1) { return [0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9]; }
    if (character.reputation[faction]?.total >= 2)  { return [0, 1, 2, 3, 4, null, 5, 6, 7, 8, 9, null, 10, 11, 12, 13, 14]; }

    return [0, 1, 2, 3, 4];
  }

  setNotoriety(character: ICharacter, faction: string, value: number): void {
    if (value === null) { return; }

    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };

    const oldVal = character.reputation[faction].notoriety;
    if (oldVal === value) {
      character.reputation[faction].notoriety = value - 1;

    } else {
      character.reputation[faction].notoriety = value;
    }

    const curNotoriety = character.reputation[faction].notoriety;
    const curPrestige = character.reputation[faction].prestige;
    const curTotal = character.reputation[faction].total;

    if ((curNotoriety >= 3 && curTotal >= 0)
    ||  (curNotoriety >= 6 && curTotal === -1)
    ||  (curNotoriety >= 9 && curTotal === -2)) {
      this.lowerNotoriety(character, faction);

      if (curPrestige >= 10 && curTotal >= 2) {
        character.reputation[faction].prestige -= 10;
        character.reputation[faction].total += 1;
      }

      if (curPrestige >= 5 && curTotal === 1) {
        character.reputation[faction].prestige -= 5;
        character.reputation[faction].total += 1;
      }
    }

    this.save();
  }

  setPrestige(character: ICharacter, faction: string, value: number): void {
    if (value === null) { return; }

    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };

    const oldVal = character.reputation[faction].prestige;
    if (oldVal === value) {
      character.reputation[faction].prestige = value - 1;

    } else {
      character.reputation[faction].prestige = value;
    }

    const curNotoriety = character.reputation[faction].notoriety;
    const curPrestige = character.reputation[faction].prestige;
    const curTotal = character.reputation[faction].total;


    if ((curPrestige >= 5  && curTotal <= 0)
    ||  (curPrestige >= 10 && curTotal === 1)
    ||  (curPrestige >= 15 && curTotal === 2)) {
      this.increasePrestige(character, faction);

      if (curNotoriety >= 6 && curTotal <= -2) {
        character.reputation[faction].notoriety -= 6;
        character.reputation[faction].total -= 1;
      }

      if (curNotoriety >= 3 && curTotal === -1) {
        character.reputation[faction].notoriety -= 3;
        character.reputation[faction].total -= 1;
      }
    }

    this.save();
  }

  lowerNotoriety(character: ICharacter, faction: string): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].total = character.reputation[faction].total || 0;

    character.reputation[faction].total = clamp(character.reputation[faction].total - 1, -3, 3);
    character.reputation[faction].notoriety = 0;

    this.save();
  }

  increasePrestige(character: ICharacter, faction: string): void {
    character.reputation[faction] = character.reputation[faction] || { notoriety: 0, prestige: 0, total: 0 };
    character.reputation[faction].total = character.reputation[faction].total || 0;

    character.reputation[faction].total = clamp(character.reputation[faction].total + 1, -3, 3);
    character.reputation[faction].prestige = 0;

    this.save();
  }

  private save(): void {
    this.data.patchCharacter().subscribe(() => {});
  }

}
