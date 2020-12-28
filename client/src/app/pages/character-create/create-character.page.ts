import { Component, OnInit } from '@angular/core';

enum CharacterCreateStep {
  CampaignOrNo = 'campaigncode',
  Archetype = 'archetype',
  NameSpecies = 'namespecies',
  Background = 'background',
  Drives = 'drives',
  Natures = 'natures',
  Connections = 'connections',
  BonusStats = 'bonusstats',
  Moves = 'moves',
  Finalize = 'finalize'
}

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.page.html',
  styleUrls: ['./create-character.page.scss'],
})
export class CreateCharacterPage implements OnInit {

  public readonly Step = CharacterCreateStep;
  public currentStep: CharacterCreateStep;

  constructor() { }

  ngOnInit() {
  }

}
