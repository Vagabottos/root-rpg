import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser } from '../../interfaces';

import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserAPIService {

  private user = new BehaviorSubject<IUser>(null);
  public user$ = this.user.asObservable();

  public get hasUser(): boolean {
    return !!this.user.getValue();
  }

  public get userId(): string {
    return this.user.getValue()._id;
  }

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
    localStorage.setItem('email', '');
    localStorage.setItem('password', '');

    return this.http.post(this.api.apiUrl('/authentication'), {
      strategy: 'local',
      ...args
    }).pipe(tap(() => {
      localStorage.setItem('email', args.email);
      localStorage.setItem('password', args.password);
    }));
  }

  public logout() {
    localStorage.setItem('email', '');
    localStorage.setItem('password', '');
  }

  public passwordChange(args): Observable<any> {
    return this.http.post(this.api.apiUrl('/authManagement'), {
      action: 'passwordChange',
      value: {
        user: {
          email: this.user.getValue().email
        },
        ...args
      },
    });
  }

  public sendResetPassword(args): Observable<any> {
    return this.http.post(this.api.apiUrl('/authManagement'), {
      action: 'sendResetPwd',
      value: {
        email: args.email
      },
    });
  }

  public resetPassword(args): Observable<any> {
    return this.http.post(this.api.apiUrl('/authManagement'), {
      action: 'resetPwdLong',
      value: {
        token: args.token,
        password: args.password
      },
    });
  }
}
