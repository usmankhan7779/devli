
import {EMPTY,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { environment } from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

@Injectable()
export class TeamsResolver implements Resolve<any> {
  constructor(
    private serverResponseService: ServerResponseService,
    private router: Router,
    private http: TransferHttp
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.getTeamList().pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }

  getTeamList() {
    const endpoint = `${environment.api_url}/mlb/fetch/teams`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
