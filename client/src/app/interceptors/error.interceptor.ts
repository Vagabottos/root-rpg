
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private readonly badMessages = ['No record found for id'];

  constructor(private notification: NotificationService) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(httpRequest)
      .pipe(catchError((error: HttpErrorResponse) => {
        const errorMsg = error?.error?.message ?? 'Unknown error.';

        // some messages are pretty annoying and shouldnt be shown
        if (!this.badMessages.every(msg => errorMsg.includes(msg))) {
          this.notification.notify(errorMsg);
        }

        return throwError(error);
      }));

  }

}
