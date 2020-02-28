
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NewsService } from './news.service';
import { ServerResponseService } from '../../shared/services/server-response.service';

const redirectList = {
  'mia-marlins': 'miami-marlins',
  'wsh-nationals': 'washington-nationals',
  'sd-padres': 'san-diego-padres',
  'mil-brewers': 'milwaukee-brewers',
  'col-rockies': 'colorado-rockies',
  'pit-pirates': 'pittsburgh-pirates',
  'sf-giants': 'san-francisco-giants',
  'chw-white-sox': 'chicago-white-sox',
  'min-twins': 'minnesota-twins',
  'los-angeles-angels-of-anaheim': 'los-angeles-angels',
  'bal-orioles': 'baltimore-orioles',
  'bos-red-sox': 'boston-red-sox',
  'nyy-yankees': 'new-york-yankees',
  'tb-rays': 'tampa-bay-rays',
  'tor-blue-jays': 'toronto-blue-jays',
  'cle-indians': 'cleveland-indians',
  'det-tigers': 'detroit-tigers',
  'kc-royals': 'kansas-city-royals',
  'hou-astros': 'houston-astros',
  'laa-angels': 'los-angeles-angels',
  'oak-athletics': 'oakland-athletics',
  'sea-mariners': 'seattle-mariners',
  'tex-rangers': 'texas-rangers',
  'atl-braves': 'atlanta-braves',
  'nym-mets': 'new-york-mets',
  'phi-phillies': 'philadelphia-phillies',
  'chc-cubs': 'chicago-cubs',
  'cin-reds': 'cincinnati-reds',
  'stl-cardinals': 'st-louis-cardinals',
  'ari-diamondbacks': 'arizona-diamondbacks',
  'lad-dodgers': 'los-angeles-dodgers'
};

@Injectable()
export class NewsResolver implements Resolve<any> {
  constructor(
    private serverResponseService: ServerResponseService,
    private newsService: NewsService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['team_name'] && redirectList.hasOwnProperty(route.params['team_name'])) {
      return this.serverResponseService.redirect(`/mlb/news/${redirectList[route.params['team_name']]}`);
    }
    return this.newsService.getTeamNews(route.params['team_name'], this.newsService.getPreSelectedTeamSeason()).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return observableOf(null);
      }));
  }
}
