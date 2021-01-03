import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICampaign, ICharacter } from '../../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private char: BehaviorSubject<ICharacter> = new BehaviorSubject<ICharacter>(null);
  private campaign: BehaviorSubject<ICampaign> = new BehaviorSubject<ICampaign>(null);

  public get char$(): Observable<ICharacter> {
    return this.char.asObservable();
  }

  public get campaign$(): Observable<ICampaign> {
    return this.campaign.asObservable();
  }

  constructor() { }

  public setActiveCharacter(char: ICharacter): void {
    this.char.next(char);
  }

  public setActiveCampaign(campaign: ICampaign): void {
    this.campaign.next(campaign);
  }
}
