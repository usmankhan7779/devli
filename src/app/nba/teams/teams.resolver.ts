
import {EMPTY,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { environment } from '../../../environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { NbaService } from '../nba.service';

@Injectable()
export class TeamsResolver implements Resolve<any> {
  constructor(
    private serverResponseService: ServerResponseService,
    private router: Router,
    private http: TransferHttp,
    private nbaService: NbaService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.getTeamList().pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }

  private getTeamList() {
    const endpoint = `${environment.api_url}/nba/fetch/teams`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        if (this.nbaService.forceOffseason) {
          try {
            for (let i = 0; i < response.data.length; i++) {

              for (let j = 0; j < response.data[i].divisions.length; j++) {

                for (let k = 0; k < response.data[i].divisions[j].teams.length; k++) {

                  response.data[i].divisions[j].teams[k].matchup_route = null;

                }
              }

            }
          } catch (e) {
            console.error(e);
          }
        }
        return response;
      }));
  }
}
