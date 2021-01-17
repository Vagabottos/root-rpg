import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICharacter, ITableData } from '../../interfaces';
import { APIService } from './api.service';
import { ContentService } from './content.service';
import { UserAPIService } from './user.api.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterHelperService {

  constructor(
    private content: ContentService
  ) { }

  // stat functions
  getStatTotal(character: ICharacter, stat: string): number {
    const base = character.stats[stat];
    const bonus = character.moves.reduce((prev, cur) => prev + (this.content.getMove(cur)?.addStat?.[stat] ?? 0), 0);
    return base + bonus;
  }

  // harm functions
  harmCount(character: ICharacter, harm: string): number {
    const boost = character.moves.reduce((prev, cur) => prev + (this.content.getMove(cur)?.addHarm?.[harm] ?? 0), 0);
    const advBoost = character.harmBoost?.[harm] ?? 0;
    return 4 + advBoost + boost;
  }

  harmMax(character: ICharacter): number[] {
    const max = Math.max(
      this.harmCount(character, 'injury'),
      this.harmCount(character, 'exhaustion'),
      this.harmCount(character, 'depletion')
    );

    return Array(max).fill(0).map((x, i) => i);
  }

}
