
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
    const endpoint = `${environment.api_url}/cfb/fetch/teams`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return this.handleBadUrls(response);
      }));
  }

  private handleBadUrls(response) {
    if (response && response.data && response.data.length) {
      const length = response.data.length;
      let innerLength = 0;
      for (let i = 0; i < length; i++) {
        if (response.data[i].teams && response.data[i].teams.length) {
          innerLength = response.data[i].teams.length;
          for (let x = 0; x < innerLength; x++) {
            if (response.data[i].teams[x] &&
              response.data[i].teams[x].roster_route === '/college-football/roster/miami-(oh)-redhawks') {
              response.data[i].teams[x].roster_route = '/college-football/roster/miami-oh-redhawks';
            }
          }
        }
      }
    }
    return response;
  }
}
