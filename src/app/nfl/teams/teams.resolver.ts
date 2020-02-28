
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { TeamService } from './team.service';

@Injectable()
export class TeamsResolver implements Resolve<any> {
  constructor(
    private serverResponseService: ServerResponseService,
    private router: Router,
    private teamService: TeamService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.teamService.getTeamList().pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }));
  }
}
