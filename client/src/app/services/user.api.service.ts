import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models';

import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserAPIService {

  private user = new BehaviorSubject<IUser>(null);
  public user$ = this.user.asObservable();

  constructor(
    private api: APIService,
    private http: HttpClient
  ) { }

  public setUser(user: IUser): void {
    this.user.next(user);
  }

  public register(args): Observable<any> {
    return this.http.post(this.api.apiUrl('/users'), {
      ...args
    });
  }

  public login(args): Observable<any> {
    return this.http.post(this.api.apiUrl('/authentication'), {
      strategy: 'local',
      ...args
    });
  }

}
