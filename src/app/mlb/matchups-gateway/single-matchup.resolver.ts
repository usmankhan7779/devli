
import {EMPTY,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatchupsGatewayService } from './matchups-gateway.service';
import { ServerResponseService } from '../../shared/services/server-response.service';

@Injectable()
export class SingleMatchupResolver implements Resolve<any> {
  constructor(
    private matchupsService: MatchupsGatewayService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let apiCall: Observable<any>;
    if (this.matchupsService.getPreSelectedMatchupId()) {
      apiCall = this.matchupsService.getMatchupById(this.matchupsService.getPreSelectedMatchupId());
      this.matchupsService.removePreSelectedMatchupId();
    } else {
      apiCall = this.matchupsService.getSingleMatchup(route.params.team_names);
    }
    return apiCall.pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }),
      map((res) => {
        if (typeof res === 'string') {
          return JSON.parse(res);
        }
        return res;
      }),);
  }
}
