import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as jsonpatch from 'fast-json-patch';

import { ICampaign, ICharacter } from '../../interfaces';
import { CharacterAPIService } from './character.api.service';
import { CampaignAPIService } from './campaign.api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private charObs: jsonpatch.Observer<ICharacter>;
  private campaignObs: jsonpatch.Observer<ICampaign>;

  private char: BehaviorSubject<ICharacter> = new BehaviorSubject<ICharacter>(null);
  private campaign: BehaviorSubject<ICampaign> = new BehaviorSubject<ICampaign>(null);
  private campaignCharacters: BehaviorSubject<ICharacter[]> = new BehaviorSubject<ICharacter[]>([]);
  private campaignClearing: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  public get char$(): Observable<ICharacter> {
    return this.char.asObservable();
  }

  public get campaign$(): Observable<ICampaign> {
    return this.campaign.asObservable();
  }

  public get campaignCharacters$(): Observable<ICharacter[]> {
    return this.campaignCharacters.asObservable();
  }

  public get campaignClearing$(): Observable<number> {
    return this.campaignClearing.asObservable();
  }

  constructor(
    private characterAPI: CharacterAPIService,
    private campaignAPI: CampaignAPIService
  ) { }

  public setActiveCharacter(char: ICharacter): void {
    this.char.next(char);

    if (!char && this.charObs) {
      this.charObs.unobserve();
      this.charObs = null;
    }

    if (char && !this.charObs) {
      this.charObs = jsonpatch.observe(char);
    }
  }

  public getCharacterDiff(): jsonpatch.Operation[] {
    return jsonpatch.generate(this.charObs);
  }

  public patchCharacter() {
    const baseChar = this.char.getValue();
    const id = baseChar?._id;
    const patches = this.getCharacterDiff();
    if (patches.length === 0 || !id) { return; }

    const patchObj = patches.map(x => x.path.substring(1).split('/')).reduce((prev, cur) => {
      prev[cur[0]] = baseChar[cur[0]];
      return prev;
    }, {});

    return this.characterAPI.patchCharacter(id, patchObj);
  }

  public setActiveCampaign(campaign: ICampaign): void {
    this.campaign.next(campaign);

    if (!campaign && this.campaignObs) {
      this.campaignObs.unobserve();
      this.campaignObs = null;
      this.campaignCharacters.next([]);
    }

    if (campaign && !this.campaignObs) {
      this.campaignObs = jsonpatch.observe(campaign);

      this.campaignAPI.getCampaignCharacters(campaign._id)
        .subscribe(chars => {
          this.campaignCharacters.next(chars.data);
        });
    }
  }

  public getCampaignDiff(): jsonpatch.Operation[] {
    return jsonpatch.generate(this.campaignObs);
  }

  public patchCampaign() {
    const baseCamp = this.campaign.getValue();
    const id = baseCamp?._id;
    const patches = this.getCampaignDiff();
    if (patches.length === 0 || !id) { return; }

    const patchObj = patches.map(x => x.path.substring(1).split('/')).reduce((prev, cur) => {
      prev[cur[0]] = baseCamp[cur[0]];
      return prev;
    }, {});

    return this.campaignAPI.patchCampaign(id, patchObj);
  }

  public setActiveCampaignClearing(clearing: number) {
    this.campaignClearing.next(clearing);
  }
}
