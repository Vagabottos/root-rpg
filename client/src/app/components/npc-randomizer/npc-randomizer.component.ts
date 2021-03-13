import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { clamp } from 'lodash';

import { INPC } from '../../../interfaces';
import { NPCCreatorService } from '../../services/npc-creator.service';

@Component({
  selector: 'app-npc-randomizer',
  templateUrl: './npc-randomizer.component.html',
  styleUrls: ['./npc-randomizer.component.scss'],
})
export class NPCRandomizerComponent implements OnInit {

  @Input() validFactions: string[] = [];
  @Input() maxNPCs = 15;

  public npcs: INPC[] = [];

  public generateNPCCount = 1;
  public generateArmor = true;
  public generateWeapons = true;
  public generateBows = true;
  public generateShields = true;
  public generateInjury = { lower: 1, upper: 4 };
  public generateExhaustion = { lower: 1, upper: 4 };
  public generateDepletion = { lower: 1, upper: 4 };
  public generateMorale = { lower: 1, upper: 4 };

  public get maxCreatableNPCS(): number {
    return this.maxNPCs - this.npcs.length;
  }

  public get canCreateNPCs(): boolean {
    return this.maxCreatableNPCS > 0;
  }

  constructor(
    private modal: ModalController,
    private npcCreator: NPCCreatorService
  ) { }


  ngOnInit() {
  }

  dismiss(npcs?: INPC[]) {
    this.modal.dismiss(npcs);
  }

  numBoxes(num: number): null[] {
    return Array(num).fill(null);
  }

  createNPCs() {
    for (let i = 0; i < this.generateNPCCount; i++) {
      this.npcs.push(this.npcCreator.createRandomNPC({
        validFactions: this.validFactions,
        pickWeapon: this.generateWeapons,
        pickArmor: this.generateArmor,
        pickBow: this.generateBows,
        pickShield: this.generateShields,
        injuryRange: [this.generateInjury.lower, this.generateInjury.upper],
        exhaustionRange: [this.generateExhaustion.lower, this.generateExhaustion.upper],
        depletionRange: [this.generateDepletion.lower, this.generateDepletion.upper],
        moraleRange: [this.generateMorale.lower, this.generateMorale.upper],
      }));
    }

    this.generateNPCCount = clamp(this.generateNPCCount, 1, this.maxCreatableNPCS);
    if (isNaN(this.generateNPCCount)) { this.generateNPCCount = 1; }
  }

  removeNPC(npc: INPC): void {
    this.npcs = this.npcs.filter(x => x !== npc);
  }

}
