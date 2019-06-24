import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('mean_token');

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.logoutRequired) {
            this.authService.reset();
          }
        }
        return event;
      }),
      catchError((error: Error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error && error.error.logoutRequired) {
            this.authService.logout();
          }
        }
        return throwError(error);
      })
    );
  }
}
