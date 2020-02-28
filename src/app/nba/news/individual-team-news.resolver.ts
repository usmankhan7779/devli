
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NewsService } from './news.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import * as _ from 'lodash';

const mlbRedirectList = [
  'houston-astros',
  'chicago-cubs'
];

@Injectable()
export class IndividualTeamNewsResolver implements Resolve<any> {
  constructor(
    private newsService: NewsService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (_.includes(mlbRedirectList, route.params['team_name'])) {
      return this.serverResponseService.redirect(`/mlb/news/${route.params['team_name']}`);
    }
    return this.newsService.getTeamNews(route.params['team_name'], this.newsService.getPreSelectedTeamSeason()).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
