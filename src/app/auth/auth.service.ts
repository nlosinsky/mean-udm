import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + 'user';

@Injectable({providedIn: 'root'})
export class AuthService {
  authStatus$: Observable<boolean>;
  userId: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.authStatus$ = this.authStatusListener.asObservable();
    this.changeAuthStatus();
  }

  signup(data: AuthData) {
    return this.http.post(BACKEND_URL + '/signup', data)
      .pipe(
        tap(() => this.router.navigate(['/auth/login']))
      );
  }

  login(data: AuthData) {
    return this.http.post(BACKEND_URL + '/login', data)
      .pipe(
        tap(({token, userId}: any) => {
          localStorage.setItem('mean_token', token || '');
          localStorage.setItem('mean_user_id', userId || '');
        }),
        tap(() => this.changeAuthStatus()),
        tap(() => this.router.navigate(['/']))
      );
  }

  logout() {
    this.reset();
    this.router.navigate(['/']);
  }

  reset() {
    localStorage.removeItem('mean_token');
    localStorage.removeItem('mean_user_id');
    this.changeAuthStatus();
  }

  private changeAuthStatus() {
    const token = localStorage.getItem('mean_token');
    this.userId = localStorage.getItem('mean_user_id');

    this.authStatusListener.next(!!token);
  }
}
