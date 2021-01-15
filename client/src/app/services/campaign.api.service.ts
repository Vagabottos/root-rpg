import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jsonpatch from 'fast-json-patch';

import { Observable } from 'rxjs';
import { ICharacter } from '../../../../shared/interfaces';
import { ICampaign, ITableData } from '../../interfaces';
import { APIService } from './api.service';
import { UserAPIService } from './user.api.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignAPIService {

  constructor(
    private api: APIService,
    private userAPI: UserAPIService,
    private http: HttpClient
  ) { }

  createCampaign(opts: Partial<ICampaign>): Observable<ICampaign> {
    return this.http.post(this.api.apiUrl('/campaign'), opts) as Observable<ICampaign>;
  }

  getCampaigns(page = 0): Observable<ITableData<ICampaign>> {
    const limit = 20;

    const params = new HttpParams()
      .set('owner', this.userAPI.userId)
      .set('$sort[updatedAt]', '-1')
      .set('$skip', (page * limit).toString())
      .set('$limit',  limit.toString());

    return this.http.get(this.api.apiUrl(`/campaign`), { params }) as Observable<ITableData<ICampaign>>;
  }

  loadCampaign(id: string): Observable<ICampaign> {
    return this.http.get(this.api.apiUrl(`/campaign/${id}`)) as Observable<ICampaign>;
  }

  patchCampaign(id: string, campaign: Partial<ICampaign>): Observable<ICampaign> {
    return this.http.patch(this.api.apiUrl(`/campaign/${id}`), campaign) as Observable<ICampaign>;
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete(this.api.apiUrl(`/campaign/${id}`));
  }

  getCampaignCharacters(id: string): Observable<ICharacter[]> {
    const params = new HttpParams()
      .set('campaign', id);

    return this.http.get(this.api.apiUrl('/character'), { params }) as Observable<ICharacter[]>;
  }

}
