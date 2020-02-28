import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable , Subject, from } from 'rxjs';
import { TransferState } from '../transfer-state/transfer-state';
import { isPlatformServer } from '@angular/common';
import { tap } from 'rxjs/operators';



import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

/* tslint:disable */

@Injectable()
export class TransferHttp {

  private isServer = isPlatformServer(this.platformId);

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private http: HttpClient,
    protected transferState: TransferState
  ) { }

  request(uri: string | HttpRequest<any>, options?: any): Observable<any> {
    return this.getData(uri, options, (url: string, options: any): Observable<any> => {
      return this.http.request(url, options);
    });
  }
  /**
   * Performs a request with `get` http method.
   */
  get(url: string, options?: any): Observable<any> {
    return this.getData(url, options, (url: string, options: any): Observable<any> => {
      return this.http.get(url, options);
    });
  }
  /**
   * Performs a request with `post` http method.
   */
  post(url: string, body: any, options?: any): Observable<any> {
    return this.getPostData(url, body, options, (url: string, body: any, options: any): Observable<any> => {
      return this.http.post(url, body, options);
    });
  }
  /**
   * Performs a request with `put` http method.
   */
  put(url: string, body: any, options?: any): Observable<any> {

    return this.getPostData(url, body, options, (url: string, body: any, options: any): Observable<any> => {
      return this.http.put(url, body, options);
    });
  }
  /**
   * Performs a request with `delete` http method.
   */
  delete(url: string, options?: any): Observable<any> {
    return this.getData(url, options, (url: string, options: any): Observable<any> => {
      return this.http.delete(url, options);
    });
  }
  /**
   * Performs a request with `patch` http method.
   */
  patch(url: string, body: any, options?: any): Observable<any> {
    return this.getPostData(url, body, options, (url: string, body: any, options: any): Observable<any> => {
      return this.http.patch(url, body, options);
    });
  }
  /**
   * Performs a request with `head` http method.
   */
  head(url: string, options?: any): Observable<any> {
    return this.getData(url, options, (url: string, options: any): Observable<any> => {
      return this.http.head(url, options);
    });
  }
  /**
   * Performs a request with `options` http method.
   */
  options(url: string, options?: any): Observable<any> {
    return this.getData(url, options, (url: string, options: any): Observable<any> => {
      return this.http.options(url, options);
    });
  }

  private getData(uri: string | HttpRequest<any>, options: any, callback: (uri: string, options?: any) => Observable<HttpResponse<any>>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + ''/*(JSON.stringify(options) || '')*/;

    try {
      return this.resolveData(key);

    } catch (e) {
      return callback(<string>url, options).pipe(tap(data => {
        if (this.isServer) {
          this.setCache(key, data);
        }
      }));
    }
  }

  private getPostData(uri: string | HttpRequest<any>, body: any, options: any, callback: (uri: string | HttpRequest<any>, body: any, options?: any) => Observable<HttpResponse<any>>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + ''/*(JSON.stringify(body) || '')*/;

    try {

      return this.resolveData(key);

    } catch (e) {
      return callback(uri, body, options).pipe(tap(data => {
        if (this.isServer) {
          this.setCache(key, data);
        }
      }));
    }
  }

  private resolveData(key: string) {
    const data = this.getFromCache(key);

    if (!data) {
      throw new Error();
    }

    return from(Promise.resolve(data));
  }

  private setCache(key, data) {
    return this.transferState.set(key, data);
  }

  private getFromCache(key): any {
    return this.transferState.get(key);
  }
}
