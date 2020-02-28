
import {EMPTY,  Observable } from 'rxjs';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';
import { Response } from 'express';
import { Router } from '@angular/router';

@Injectable()
export class ServerResponseService {
  constructor(
    private router: Router,
    @Optional() @Inject(RESPONSE) private response: any
  ) {
  }

  public setNotFound(message: string = 'not found') {
    if (this.response) {
      this.response.statusCode = 404;
      this.response.statusMessage = message;
    }
  }

  getHeader(key: string): string {
    return this.response.getHeader(key) as string;
  }

  setHeader(key: string, value: string): void {
    if (this.response) {
      this.response.header(key, value);
    }
  }

  serverRedirect(redirectUrl, status = 301) {
    if (this.response) {
      try {
        this.response.redirect(status, redirectUrl);
        this.response.end();
      } catch (e) {
        console.error(e);
        throw e;
      }

      // I haven't found a way to correctly stop Angular rendering.
      // So we just let it end its work, though we have already closed
      // the response.
    }
  }

  redirect(redirectUrl) {
    this.serverRedirect(redirectUrl);
    this.router.navigate([redirectUrl]);
    return EMPTY;
  }

  checkCurrentSeasonRedirectApiError(err) {
    return err && err.status === 400 && err.error && (err.error.status === 301 || err.error.status === '301');
  }

  appendHeader(key: string, value: string, delimiter = ','): void {
    if (this.response) {
      const current = this.getHeader(key);
      if (!current) {
        return this.setHeader(key, value);
      }

      const newValue = [...current.split(delimiter), value]
        .filter((el, i, a) => i === a.indexOf(el))
        .join(delimiter);

      this.response.header(key, newValue);
    }
  }

  setStatus(code: number, message?: string): void {
    if (this.response) {
      this.response.statusCode = code;
      if (message) {
        this.response.statusMessage = message;
      }
    }
  }
}
