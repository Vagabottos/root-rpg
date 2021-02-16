
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private readonly badMessages = ['No record found for id', 'Unknown error.'];

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(httpRequest)
      .pipe(catchError((error: HttpErrorResponse) => {
        const errorMsg = error?.error?.message ?? 'Unknown error.';

        const isLoggedIn = localStorage.getItem('email');

        if (isLoggedIn) {
          if (error?.error.code === 401) {
            this.router.navigate(['/login']);
            this.notification.notify('Your previous session has expired. Please login again.');
            return throwError(error);
          }

          // some messages are pretty annoying and shouldnt be shown
          if (!this.badMessages.every(msg => errorMsg.includes(msg))) {
            this.notification.notify(errorMsg);
          }
        }

        return throwError(error);
      }));

  }

}
