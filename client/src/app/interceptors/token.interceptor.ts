
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserAPIService } from '../services/user.api.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private userAPI: UserAPIService) {}

  // grab access token where applicable and cache it
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token') || '';

    return next.handle(httpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
      .pipe(tap((d: HttpResponse<any>) => {
        if (!d.body) { return; }

        const { accessToken, user } = d.body;

        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }

        if (user) {
          this.userAPI.setUser(user);
        }
      }));
  }

}
