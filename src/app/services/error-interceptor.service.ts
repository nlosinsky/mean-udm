import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return  next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error.error.error);
          const message = this.getErrorMessage(error);

          if (message) {
            this.snackBar.open(message, null, {
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['error'],
              duration: 3000
            });
          }

          return  throwError(error);
        })
      );
  }

  getErrorMessage(error) {
    if (!(error && error.message && !error.status)) {
      if (error.error) {
        return this.getErrorMessage(error.error);
      }

      return 'An error occurred';
    }

    return error.message;
  }
}
