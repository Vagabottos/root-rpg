import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICampaign, ITableData } from '../models';
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

  createCampaign(opts: ICampaign): Observable<ICampaign> {
    return this.http.post(this.api.apiUrl('/campaign'), opts) as Observable<ICampaign>;
  }

  getCampaigns(page = 0): Observable<ITableData<ICampaign>> {
    const limit = 10;

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

}
