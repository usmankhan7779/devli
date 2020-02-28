
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RosterService } from './roster.service';


@Injectable()
export class RostersHomePageResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private rosterService: RosterService,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.rosterService.getRosterRoutes().pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }))
  }
}
