
import {EMPTY,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { RosterService } from './roster.service';
import { CollegeFootballService } from '../college-football.service';


@Injectable()
export class RostersHomePageResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private collegeFootballService: CollegeFootballService,
    private rosterService: RosterService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    let _year: string | number;
    if (this.collegeFootballService.getPreSelectedSeason()) {
      _year = this.collegeFootballService.getPreSelectedSeason();
    }
    return this.rosterService.getRosterRoutes(_year).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return EMPTY;
      }))
  }
}
