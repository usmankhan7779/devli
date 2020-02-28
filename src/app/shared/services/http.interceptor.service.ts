
import { finalize, catchError, mergeMap } from 'rxjs/operators';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Observable, ReplaySubject, of, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AuthApiService } from '../../auth/auth-api.service';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {
  _authApiService: AuthApiService;
  ifTokenRefreshing;
  isIframe: boolean;
  replaySubject: ReplaySubject<any>;
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private injector: Injector,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isIframe = this.commonService.openedInIframe();
  }

  private get authApiService() {
    if (this._authApiService) {
      return this._authApiService;
    }
    this._authApiService = this.injector.get(AuthApiService);
    return this._authApiService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(this.applyCredentials(req)).pipe(
    catchError((error) => {
      if (isPlatformServer(this.platformId)) {
        return throwError(error);
      }
      if (this.isRefreshTokenError(error)) {
        this.ifTokenRefreshing = undefined;
        this.showLoginPopup();
        /*else if (this.iframeUserAuthCheck()) {
         throw error;
       } else {
         this.authService.showLoginPopup();
       }*/
        throw error;
      }
      if (!this.isAuthError(error)) {
        throw error;
      }
      if (!this.ifTokenRefreshing) {
        this.replaySubject = new ReplaySubject(1);
        this.authApiService.refreshToken()
          .subscribe(res => this.replaySubject.next(res));
        this.ifTokenRefreshing = this.replaySubject.asObservable();
      }
      return this.ifTokenRefreshing.pipe(mergeMap((res: any) => {
        if (res && res.refresh && res.access) {
          this.authService.setRefreshToken(res.refresh);
          this.authService.setToken(res.access);
          return next.handle(this.applyCredentials(req)).pipe(
            finalize(() => {
              this.replaySubject.complete();
              this.ifTokenRefreshing = undefined;
            }));
        } else {
          this.replaySubject.complete();
          this.ifTokenRefreshing = undefined;
          this.showLoginPopup();
        }
      }));
    })) as any;
  }

  private showLoginPopup() {
    this.authService.logoutWithoutRedicrect();
    if (!this.iframeUserAuthCheck() && this.checkBetPredictorLocation()) {
      const options = {
        loginHeader: 'Login to Continue',
        blockUserActivity: true
      };
      setTimeout(() => {
        if (this.checkBetPredictorLocation()) {
          this.authService.showLoginPopup(options);
        }
      }, 15000);
    }
  }


  private isAuthError(error: any): boolean {
    if (this.iframeUserAuthCheck()) {
      return false;
    }
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  // check if error from refresh Token response
  private isRefreshTokenError(error: any): boolean {
    return error instanceof HttpErrorResponse && error.url && error.url.indexOf('/auth/v2/refresh') !== -1 && error.status === 400;
  }

  // add auth headers if exists
  private applyCredentials(req: HttpRequest<any>) {
    if (req.url.indexOf('dailyfantasycafe.com/api') !== -1) {
      const JWT = 'Basic ZGZjZGF0YTpkZmNkYXRh';
      req = req.clone({
        setHeaders: {
          Authorization: JWT
        }
      });
    } else
    if (!this.iframeUserAuthCheck() && this.authService.getToken() && this.authService.getRefreshToken()) {
      const JWT = `JWT ${this.authService.getToken()}`;
      req = req.clone({
        setHeaders: {
          Authorization: JWT
        }
      });
    } else if (this.iframeUserAuthCheck()) {
      const JWT = 'Iframe';
      req = req.clone({
        setHeaders: {
          Authorization: JWT,
        }
      });
    }
    return req;
  }

  private checkBetPredictorLocation() {
    return this.router.url &&
      (this.router.url.indexOf('/mlb/betting-system') !== -1 || this.router.url.indexOf('/nfl/betting-system') !== -1);
  }

  private iframeUserAuthCheck() {
    return this.isIframe &&
      (this.router.url && this.router.url.indexOf('/mlb/betting-system') !== -1 ||
      this.router.url.indexOf('/nfl/simulator') !== -1 ||
      this.router.url.indexOf('/nfl/watch-simulation') !== -1 ||
      this.router.url.indexOf('/vegas-odds/nfl-live-vegas-odds') !== -1 ||
      this.router.url.indexOf('/vegas-odds/nba-live-vegas-odds') !== -1 ||
      this.router.url.indexOf('/vegas-odds/mlb-live-vegas-odds') !== -1 ||
      this.router.url.indexOf('/nfl/betting-system') !== -1) &&
      // this.router.url.indexOf('user_id=') !== -1 &&
      this.router.url.indexOf('domain=') !== -1;
  }
}
