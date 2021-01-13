import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as jsonpatch from 'fast-json-patch';

import { ICharacter, ITableData } from '../../interfaces';
import { APIService } from './api.service';
import { UserAPIService } from './user.api.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterAPIService {

  constructor(
    private api: APIService,
    private userAPI: UserAPIService,
    private http: HttpClient
  ) { }

  createCharacter(opts): Observable<ICharacter> {
    return this.http.post(this.api.apiUrl('/character'), opts) as Observable<ICharacter>;
  }

  getCharacters(page = 0): Observable<ITableData<ICharacter>> {
    const limit = 10;

    const params = new HttpParams()
      .set('owner', this.userAPI.userId)
      .set('$sort[updatedAt]', '-1')
      .set('$skip', (page * limit).toString())
      .set('$limit',  limit.toString());

    return this.http.get(this.api.apiUrl(`/character`), { params }) as Observable<ITableData<ICharacter>>;
  }

  loadCharacter(id: string): Observable<ICharacter> {
    return this.http.get(this.api.apiUrl(`/character/${id}`)) as Observable<ICharacter>;
  }

  patchCharacter(id: string, patches: jsonpatch.Operation[]): Observable<ICharacter> {
    return this.http.patch(this.api.apiUrl(`/character/${id}`), patches) as Observable<ICharacter>;
  }

  deleteCharacter(id: string): Observable<any> {
    return this.http.delete(this.api.apiUrl(`/character/${id}`));
  }
}
