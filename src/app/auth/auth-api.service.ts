
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  resetPassword(email: string): Observable<any> {
    const endpoint = `${environment.api_url}/auth/reset-password`;
    return this.http.post(endpoint, {email: email}).pipe(
      map((res: any) => {
        return res;
      }));
  }

  loginWith(data: any): Observable<any> {
    const endpoint = `${environment.api_url}/auth/v2/login`;
    return this.http.post(endpoint, data);
  }

  signupWith(data: any): Observable<any> {
    const endpoint = `${environment.api_url}/auth/register`;
    return this.http.post(endpoint, data).pipe(
      map((res: any) => {
        return res;
      }));
  }

  verifyWith(code: string): Observable<any> {
    const endpoint = `${environment.api_url}/auth/activate`;

    return this.http.post(endpoint, {token: code});
  }

  refreshToken() {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      const endpoint = `${environment.api_url}/auth/v2/refresh`;
      return this.http.post(endpoint, {'refresh': this.authService.getRefreshToken()});
    }
    return of(null);
  }
}
