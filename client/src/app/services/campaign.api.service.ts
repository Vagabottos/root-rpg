import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICampaign } from '../models';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignAPIService {

  constructor(
    private api: APIService,
    private http: HttpClient
  ) { }

  createCampaign(opts: ICampaign): Observable<ICampaign> {
    return this.http.post(this.api.apiUrl('/campaign'), opts) as Observable<ICampaign>;
  }

  loadCampaign(id: string): Observable<ICampaign> {
    return this.http.get(this.api.apiUrl(`/campaign/${id}`)) as Observable<ICampaign>;
  }

}
