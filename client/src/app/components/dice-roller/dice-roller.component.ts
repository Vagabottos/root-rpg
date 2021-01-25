import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { sample } from 'lodash';

import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

/**
 * Credits for this goes to https://codesandbox.io/s/xjk3xqnprw (@ryancperry)
 * Had to make a few tweaks so the dice rendered correctly, but I didn't come up with any of it.
 */

@Component({
  selector: 'app-dice-roller',
  templateUrl: './dice-roller.component.html',
  styleUrls: ['./dice-roller.component.scss'],
})
export class DiceRollerComponent implements OnInit {

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.rollDice();
    }, 100);
  }

  dismiss() {
    this.modal.dismiss();
  }

  rollDice() {
    const dice = [...document.querySelectorAll('.die-list') as any];
    dice.forEach(die => {
      this.toggleClasses(die);
      die.dataset.roll = sample([1, 2, 3, 4, 5, 6]);
    });
  }

  toggleClasses(die) {
    die.classList.toggle('odd-roll');
    die.classList.toggle('even-roll');
  }

}
