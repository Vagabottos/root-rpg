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

  public get char$(): Observable<ICharacter> {
    return this.char.asObservable();
  }

  public get campaign$(): Observable<ICampaign> {
    return this.campaign.asObservable();
  }

  constructor(
    private characterAPI: CharacterAPIService,
    private campaignAPI: CampaignAPIService
  ) { }

  public setActiveCharacter(char: ICharacter): void {
    this.char.next(char);

    if (!char && this.charObs) {
      this.charObs.unobserve();
    }

    if (char && !this.charObs) {
      this.charObs = jsonpatch.observe(char);
    }
  }

  public getCharacterDiff(): jsonpatch.Operation[] {
    return jsonpatch.generate(this.charObs);
  }

  public patchCharacter(): void {
    const id = this.char.getValue()?._id;
    const patches = this.getCharacterDiff();
    if (patches.length === 0 || !id) { return; }

    const patched = jsonpatch.applyPatch(this.char.getValue(), patches, false, false, true).newDocument;
    this.characterAPI.patchCharacter(id, patched).subscribe(() => {});
  }

  public setActiveCampaign(campaign: ICampaign): void {
    this.campaign.next(campaign);

    if (!campaign && this.campaignObs) {
      this.campaignObs.unobserve();
    }

    if (campaign && !this.campaignObs) {
      this.campaignObs = jsonpatch.observe(campaign);
    }
  }

  public getCampaignDiff(): jsonpatch.Operation[] {
    return jsonpatch.generate(this.campaignObs);
  }

  public patchCampaign(): void {
    const id = this.campaign.getValue()?._id;
    const patches = this.getCampaignDiff();
    if (patches.length === 0 || !id) { return; }

    const patched = jsonpatch.applyPatch(this.campaign.getValue(), patches, false, false, true).newDocument;
    this.campaignAPI.patchCampaign(id, patched).subscribe(() => {});
  }
}
