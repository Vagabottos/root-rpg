import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as jsonpatch from 'fast-json-patch';

import { ICampaign, ICharacter, IClearing } from '../../interfaces';
import { CharacterAPIService } from './character.api.service';
import { CampaignAPIService } from './campaign.api.service';
import { catchError, tap } from 'rxjs/operators';
import { SocketService } from './socket.service';

interface IClearingData {
  index: number;
  clearing: IClearing;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private charObs: jsonpatch.Observer<ICharacter>;
  private campaignObs: jsonpatch.Observer<ICampaign>;

  private char: BehaviorSubject<ICharacter> = new BehaviorSubject<ICharacter>(null);
  private campaign: BehaviorSubject<ICampaign> = new BehaviorSubject<ICampaign>(null);
  private campaignCharacters: BehaviorSubject<ICharacter[]> = new BehaviorSubject<ICharacter[]>([]);
  private campaignClearing: BehaviorSubject<IClearingData> = new BehaviorSubject<IClearingData>({ index: -1, clearing: null });

  public get char$(): Observable<ICharacter> {
    return this.char.asObservable();
  }

  public get campaign$(): Observable<ICampaign> {
    return this.campaign.asObservable();
  }

  public get campaignCharacters$(): Observable<ICharacter[]> {
    return this.campaignCharacters.asObservable();
  }

  public get campaignClearing$(): Observable<IClearingData> {
    return this.campaignClearing.asObservable();
  }

  constructor(
    private socket: SocketService,
    private characterAPI: CharacterAPIService,
    private campaignAPI: CampaignAPIService
  ) { }

  public init() {
    this.socket.campaignCharacterPatch$.subscribe(data => {
      const characters = this.campaignCharacters.getValue();
      const updateCharacter = characters.find(char => char._id === data.id);
      if (updateCharacter) {
        Object.assign(updateCharacter, data.patch);
      }

      this.campaignCharacters.next(characters);
    });
  }

  public setActiveCharacter(char: ICharacter): void {

    const curChar = this.char.getValue();
    if (curChar?.campaign) { this.socket.leaveChannel(); }
    if (char?.campaign) { this.socket.joinChannel(char.campaign); }

    this.char.next(char);

    if (char && this.charObs) {
      this.charObs.unobserve();
      this.charObs = null;
      this.charObs = jsonpatch.observe(char);
    }

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
    if (patches.length === 0 || !id) { return of(null); }

    const patchObj = patches.map(x => x.path.substring(1).split('/')).reduce((prev, cur) => {
      prev[cur[0]] = baseChar[cur[0]];
      return prev;
    }, {});

    return this.characterAPI.patchCharacter(id, patchObj)
      .pipe(tap(() => this.socket.sendCharacterUpdate(id, patchObj)))
      .pipe(catchError((err) => {

        // revert on error
        this.characterAPI.loadCharacter(id)
          .subscribe(char => this.setActiveCharacter(char));

        return err;
      }));
  }

  public setActiveCampaign(campaign: ICampaign): void {
    const curCamp = this.campaign.getValue();
    if (curCamp?._id) { this.socket.leaveChannel(); }
    if (campaign?._id) { this.socket.joinChannel(campaign._id); }

    this.campaign.next(campaign);

    if (campaign && this.campaignObs) {
      this.campaignObs.unobserve();
      this.campaignObs = null;
      this.campaignObs = jsonpatch.observe(campaign);
      this.campaignCharacters.next([]);

      this.refreshCampaignPlayers(campaign._id);
    }

    if (!campaign && this.campaignObs) {
      this.campaignObs.unobserve();
      this.campaignObs = null;
      this.campaignCharacters.next([]);
    }

    if (campaign && !this.campaignObs) {
      this.campaignObs = jsonpatch.observe(campaign);

      this.refreshCampaignPlayers(campaign._id);
    }
  }

  public refreshCampaignPlayers(id: string) {
    this.campaignAPI.getCampaignCharacters(id)
      .subscribe(chars => {
        this.campaignCharacters.next(chars.data);
      });
  }

  public getCampaignDiff(): jsonpatch.Operation[] {
    return jsonpatch.generate(this.campaignObs);
  }

  public patchCampaign() {
    const baseCamp = this.campaign.getValue();
    const id = baseCamp?._id;
    const patches = this.getCampaignDiff();
    if (patches.length === 0 || !id) { return of(null); }

    const patchObj = patches.map(x => x.path.substring(1).split('/')).reduce((prev, cur) => {
      prev[cur[0]] = baseCamp[cur[0]];
      return prev;
    }, {});

    return this.campaignAPI.patchCampaign(id, patchObj)
      .pipe(tap(() => {
        this.campaignAPI.loadCampaign(id)
          .subscribe(char => this.setActiveCampaign(char));
      }))
      .pipe(catchError((err) => {

        // revert on error
        this.campaignAPI.loadCampaign(id)
          .subscribe(char => this.setActiveCampaign(char));

        return err;
      }));
  }

  public setActiveCampaignClearing(clearingData: IClearingData) {
    this.campaignClearing.next(clearingData);
  }
}
