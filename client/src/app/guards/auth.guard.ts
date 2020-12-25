
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserAPIService } from '../services/user.api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public userAPI: UserAPIService,
    public router: Router
  ) {}

  // auto log in when refreshing page if needed
  canActivate(): Observable<boolean> {
    if (this.userAPI.hasUser) { return of(true); }

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    return this.userAPI.login({ email, password })
      .pipe(
        catchError(err => {
          if (!err) { return; }

          this.router.navigate(['/login']);

          return err;
        }),
        map(val => {
          const retVal = !!val.user;

          if (!retVal) {
            this.router.navigate(['/login']);
            return false;
          }

          return true;
        })
      );
  }
}
