import { Injectable, Injector } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  showLoginPopupSubject = new Subject();
  showSignUpPopupSubject = new Subject();
  loginCallback = new Subject();
  hasStorage: boolean;
  private isServer = typeof window === 'undefined';
  constructor(
    private router: Router,
  ) {
    this.hasStorage = !!function() {
      let result;
      const uid = (+new Date).toString();
      try {
        localStorage.setItem(uid, uid);
        result = localStorage.getItem(uid) === uid;
        localStorage.removeItem(uid);
        return result;
      } catch (exception) {}
    }();
  }

  showLoginPopup(options?) {
    if (this.isServer || this.isLoggedIn()) { return; }
    this.showLoginPopupSubject.next(options);
  }

  showSignUpPopup(options?) {
    if (this.isServer) { return; }
    this.showSignUpPopupSubject.next(options);
  }

  userWasLoggedIn() {
    this.loginCallback.next();
  }

  setEmail(email: string) {
    if (this.isServer || !this.hasStorage) { return; }
    localStorage.setItem('email', email);
  }

  getEmail() {
    if (this.isServer || !this.hasStorage) { return ''; }
    return localStorage.getItem('email');
  }

  setToken(token: string) {
    if (this.isServer || !this.hasStorage) { return; }
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    if (this.isServer || !this.hasStorage) { return ''; }
    return localStorage.getItem('accessToken');
  }

  setRefreshToken(token: string) {
    if (this.isServer || !this.hasStorage) { return; }
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken() {
    if (this.isServer || !this.hasStorage) { return ''; }
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn() {
    return !!(this.getToken() && this.getRefreshToken() && this.getEmail());
  }

  logoutWithoutRedicrect() {
    if (!this.isServer || this.hasStorage) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('email');
    }
  }

  logout() {
    this.logoutWithoutRedicrect();
    this.router.navigate(['/']);
  }
}
